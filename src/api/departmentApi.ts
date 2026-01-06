// src/api/departmentApi.ts
import axios from "./axiosClient";

export const departmentApi = {
  getAll: () => axios.get("/departments"),

  getActive: () => axios.get("/departments/active"),

  create: (data: { name: string }) => axios.post("/departments", data),

  update: (id: string, data: { name?: string; isActive?: boolean }) =>
    axios.patch(`/departments/${id}`, data),

  disable: (id: string) => axios.patch(`/departments/${id}/disable`),

  remove: (id: string) => axios.delete(`/departments/${id}`),
};
