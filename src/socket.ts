import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"], // ưu tiên websocket
  withCredentials: true,
});
