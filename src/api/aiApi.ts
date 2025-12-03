import axiosClient from "./axiosClient";
export interface GoogleResult {
  title: string;
  imageUrl: string;
  snippet?: string;
  contextLink?: string;
}

export const aiApi = {
  searchGoogle(query: string) {
    return axiosClient.get("/ai/google-search", { params: { query } });
  },

  analyzeImage(imageUrl: string) {
    return axiosClient.post("/ai/analyze", { imageUrl });
  },
};
