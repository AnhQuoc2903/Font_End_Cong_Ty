import axiosClient from "./axiosClient";

export const activityApi = {
  getUserLogs(params?: { page?: number; limit?: number; action?: string }) {
    return axiosClient.get("/activity-logs/users", {
      params,
    });
  },

  getLogsByUserId(userId: string, params?: { page?: number; limit?: number }) {
    return axiosClient.get(`/activity-logs/users/${userId}`, {
      params,
    });
  },
};
