import axiosClient from "./axiosClient";
export const userApi = {
  getAll() {
    return axiosClient.get("/users");
  },
  create(data: {
    email: string;
    password: string;
    fullName?: string;
    roleIds?: string[];
    departmentId?: string;
  }) {
    return axiosClient.post("/users", data);
  },
  update(
    id: string,
    data: {
      fullName?: string;
      roleIds?: string[];
      departmentId?: string;
      isActive?: boolean;
    }
  ) {
    return axiosClient.patch(`/users/${id}`, data);
  },
  remove(id: string) {
    return axiosClient.delete(`/users/${id}`);
  },
  search: (q = "", opts: { page?: number; limit?: number } = {}) =>
    axiosClient.get("/users/search", { params: { q, ...opts } }),
};
