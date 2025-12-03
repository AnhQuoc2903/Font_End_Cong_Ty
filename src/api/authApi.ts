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
};
