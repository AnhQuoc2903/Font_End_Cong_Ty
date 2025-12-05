import axios from "axios";

export const axiosNoAuth = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // nếu bạn dùng cookie-based change accordingly
});
