import { io } from "socket.io-client";

let socket;

export const getSocket = (userId) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
