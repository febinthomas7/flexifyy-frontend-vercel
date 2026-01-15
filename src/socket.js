// src/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = (userId) => {
  if (!socket && userId) {
    socket = io(import.meta.env.VITE_BASE_RENDER_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};
