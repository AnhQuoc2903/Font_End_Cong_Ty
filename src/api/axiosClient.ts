import axios from "axios";
import { message } from "antd";
import { axiosNoAuth } from "./noAuthClient";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach access token
axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh state
let isRefreshing = false;
let subscribers: Array<(token: string | null) => void> = [];

function onRefreshed(newToken: string | null) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}
function addSubscriber(cb: (token: string | null) => void) {
  subscribers.push(cb);
}

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if ((status === 401 || status === 403) && !originalRequest?._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((token) => {
            if (token) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient.request(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      return axiosNoAuth
        .post("/auth/refresh", { refreshToken })
        .then((res) => {
          const newAccessToken = res.data.accessToken;
          const newRefreshToken = res.data.refreshToken;

          if (!newAccessToken) {
            throw new Error("No access token in refresh response");
          }

          // save tokens + user
          sessionStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken)
            sessionStorage.setItem("refreshToken", newRefreshToken);
          if (res.data.user)
            sessionStorage.setItem("user", JSON.stringify(res.data.user));

          onRefreshed(newAccessToken);
          isRefreshing = false;

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient.request(originalRequest);
        })
        .catch((err) => {
          console.error("Refresh failed", err);
          onRefreshed(null);
          isRefreshing = false;

          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("user");

          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
