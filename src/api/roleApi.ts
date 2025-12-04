import axiosClient from "./axiosClient";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const roleApi = {
  getAll() {
    return axiosClient.get("/roles");
  },
  getPermissions() {
    return axiosClient.get("/roles/permissions/all");
  },
  create(data: any) {
    return axiosClient.post("/roles", data);
  },
  update(id: string, data: any) {
    return axiosClient.patch(`/roles/${id}`, data);
  },
  remove(id: string) {
    return axiosClient.delete(`/roles/${id}`);
  },
  search: (q = "", opts: { page?: number; limit?: number } = {}) =>
    axiosClient.get("/roles/search", { params: { q, ...opts } }),
};
