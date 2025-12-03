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
  }) {
    return axiosClient.post("/users", data);
  },
  /* eslint-disable @typescript-eslint/no-explicit-any */
  update(id: string, data: any) {
    return axiosClient.patch(`/users/${id}`, data);
  },
  remove(id: string) {
    return axiosClient.delete(`/users/${id}`);
  },
};
