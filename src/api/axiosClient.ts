import axios from "axios";
import { message } from "antd";
import { axiosNoAuth } from "./noAuthClient";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach access token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      /**
       * 🔁 Nếu đang refresh → xếp hàng
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((token) => {
            if (!token) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        /**
         * 🔥 GỌI REFRESH KHÔNG GỬI GÌ
         * Browser tự gửi HttpOnly cookie
         */
        const res = await axiosNoAuth.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;
        if (!newAccessToken) throw new Error("No access token");

        // ✅ LƯU accessToken MỚI
        localStorage.setItem("accessToken", newAccessToken);

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        onRefreshed(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        /**
         * ❌ REFRESH FAIL → LOGOUT CỨNG
         */
        onRefreshed(null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
