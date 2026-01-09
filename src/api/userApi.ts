import axiosClient from "./axiosClient";

export const userApi = {
  // ===== ADMIN =====
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

  // ===== USER PROFILE =====

  /** User tự cập nhật thông tin cá nhân */
  updateMyProfile(data: {
    fullName?: string;
    phone?: string;
    avatar?: string;
  }) {
    return axiosClient.patch("/users/me/profile", data);
  },

  /** Upload avatar */
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    return axiosClient.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** Xóa avatar */
  deleteAvatar() {
    return axiosClient.delete("/users/me/avatar");
  },
};
