import axiosClient from "./axiosClient";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const artifactApi = {
  getList() {
    return axiosClient.get("/artifacts");
  },
  get(id: string) {
    return axiosClient.get(`/artifacts/${id}`);
  },
  create(data: any) {
    return axiosClient.post("/artifacts", data);
  },
  update(id: string, data: any) {
    return axiosClient.patch(`/artifacts/${id}`, data);
  },
  remove(id: string) {
    return axiosClient.delete(`/artifacts/${id}`);
  },
  import(id: string, data: { quantity: number; reason?: string }) {
    return axiosClient.post(`/artifacts/${id}/import`, data);
  },
  export(id: string, data: { quantity: number; reason?: string }) {
    return axiosClient.post(`/artifacts/${id}/export`, data);
  },
  adjust(id: string, data: { newQuantity: number; reason?: string }) {
    return axiosClient.post(`/artifacts/${id}/adjust`, data);
  },
  getTransactions(id: string) {
    return axiosClient.get(`/artifacts/${id}/transactions`);
  },
  uploadImage(id: string, file: File) {
    const fd = new FormData();
    fd.append("file", file); // phải trùng tên 'file' với multer.single('file')
    return axiosClient.post(`/artifacts/${id}/image`, fd);
  },
  deleteImage(id: string) {
    return axiosClient.delete(`/artifacts/${id}/image`);
  },

  createWithImage(fd: FormData) {
    return axiosClient.post("/artifacts", fd);
  },
  updateWithImage(id: string, fd: FormData) {
    return axiosClient.patch(`/artifacts/${id}`, fd);
  },
};
