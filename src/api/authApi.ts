import { axiosNoAuth } from "./noAuthClient";
import axiosClient from "./axiosClient";

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
  changePassword(data: { currentPassword: string; newPassword: string }) {
    return axiosClient.post("/auth/change-password", data);
  },
};
