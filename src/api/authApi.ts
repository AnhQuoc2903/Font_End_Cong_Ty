import { axiosNoAuth } from "./noAuthClient";

export const authApi = {
  login(data: { email: string; password: string }) {
    return axiosNoAuth.post("/auth/login", data);
  },
  refresh(refreshToken: string) {
    return axiosNoAuth.post("/auth/refresh", { refreshToken });
  },
  logout(refreshToken?: string) {
    return axiosNoAuth.post("/auth/logout", { refreshToken });
  },

  forgotPassword(email: string) {
    return axiosNoAuth.post("/auth/forgot-password", { email });
  },

  resetPassword(payload: { token: string; password: string }) {
    return axiosNoAuth.post("/auth/reset-password", payload);
  },
};
