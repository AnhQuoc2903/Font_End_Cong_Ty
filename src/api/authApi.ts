import { axiosNoAuth } from "./noAuthClient";

export const authApi = {
  login(data: { email: string; password: string }) {
    return axiosNoAuth.post("/auth/login", data);
  },
  refresh() {
    return axiosNoAuth.post("/auth/refresh");
  },
  logout() {
    return axiosNoAuth.post("/auth/logout");
  },

  forgotPassword(email: string) {
    return axiosNoAuth.post("/auth/forgot-password", { email });
  },

  resetPassword(payload: { token: string; password: string }) {
    return axiosNoAuth.post("/auth/reset-password", payload);
  },
};
