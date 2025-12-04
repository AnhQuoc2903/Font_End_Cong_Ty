import axiosClient from "./axiosClient";

export type Category = {
  _id: string;
  name: string;
  description?: string;
};

export const categoryApi = {
  getAll() {
    return axiosClient.get<Category[]>("/categories");
  },
  create(data: { name: string; description?: string }) {
    return axiosClient.post("/categories", data);
  },
  update(id: string, data: { name: string; description?: string }) {
    return axiosClient.patch(`/categories/${id}`, data);
  },
  delete(id: string) {
    return axiosClient.delete(`/categories/${id}`);
  },
  search: (q = "", opts: { page?: number; limit?: number } = {}) =>
    axiosClient.get("/categories/search", { params: { q, ...opts } }),
};
