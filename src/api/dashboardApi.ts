import axiosClient from "./axiosClient";

export const dashboardApi = {
  getSummary() {
    return axiosClient.get("/dashboard/summary");
  },
  getMonthlyStats() {
    return axiosClient.get("/dashboard/monthly-stats");
  },
  getLowStock(threshold = 5) {
    return axiosClient.get(`/dashboard/low-stock?threshold=${threshold}`);
  },
  exportTransactionsExcel() {
    return axiosClient.get("/dashboard/export-transactions-excel", {
      responseType: "blob",
    });
  },
  getRecentTransactions() {
    return axiosClient.get("/dashboard/recent-transactions");
  },
};
