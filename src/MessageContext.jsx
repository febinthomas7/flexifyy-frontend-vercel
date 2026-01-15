import React, { createContext, useState, useEffect } from "react";
import { getSocket } from "./socket"; // Singleton
import { handleSuccess } from "./utils";

export const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const [online, setOnline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useState(false);
  const [users, setUsers] = useState();
  const userId = localStorage.getItem("userId");

  // Authenticate user once
  useEffect(() => {
    const authenticate = async () => {
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/check-auth?userId=${userId}`,
          { headers: { Authorization: token } }
        );
        const result = await res.json();
        setAuth(result.success);
      } catch (err) {
        console.error(err);
        setAuth(false);
      }
    };
    authenticate();
  }, []); // 🔹 run only once on mount

  // Initialize socket once
  useEffect(() => {
    if (!auth || !userId) return;

    const socket = getSocket(userId);

    socket.on("getOnlineUser", setOnline);
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      handleSuccess(`Message from ${msg.senderName}`);
    });

    return () => {
      // Optional: disconnect only if you want on unmount
      // socket.disconnect();
    };
  }, [auth]);

  return (
    <MessagingContext.Provider
      value={{ online, messages, auth, users, setUsers, setAuth }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
