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
  uploadImages(id: string, files: File[]) {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    return axiosClient.post(`/artifacts/${id}/images`, fd);
  },

  deleteImage(id: string, publicId: string) {
    return axiosClient.delete(
      `/artifacts/${id}/images/${encodeURIComponent(publicId)}`
    );
  },

  createWithImage(fd: FormData) {
    return axiosClient.post("/artifacts", fd);
  },
  updateWithImage(id: string, fd: FormData) {
    return axiosClient.patch(`/artifacts/${id}`, fd);
  },
  exportExcel() {
    return axiosClient.get("/artifacts/export/excel", {
      responseType: "blob",
    });
  },
};
