import axiosClient from "./axiosClient";

export interface GetUserLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  fromDate?: string;
  toDate?: string;
}

export const activityApi = {
  getUserLogs(params?: GetUserLogsParams) {
    return axiosClient.get("/activity-logs/users", {
      params,
    });
  },

  getLogsByUserId(userId: string, params?: { page?: number; limit?: number }) {
    return axiosClient.get(`/activity-logs/users/${userId}`, {
      params,
    });
  },
  exportUserLogs(params?: Omit<GetUserLogsParams, "page" | "limit">) {
    return axiosClient.get("/activity-logs/users/export", {
      params,
      responseType: "blob",
    });
  },
  getStats() {
    return axiosClient.get("/activity-logs/users/stats");
  },
};
