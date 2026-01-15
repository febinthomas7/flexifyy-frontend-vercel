import React, { createContext, useState, useEffect } from "react";
import { getSocket, disconnectSocket } from "./socket";
import { handleSuccess } from "./utils";

export const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useState(false);
  const [users, setUsers] = useState([]);

  const userId = localStorage.getItem("userId");

  // 🔐 AUTH CHECK (run once)
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
        console.error("Auth error:", err);
        setAuth(false);
      }
    };

    authenticate();
  }, []);

  // 🔌 SOCKET INIT (only once after auth)
  useEffect(() => {
    if (!auth || !userId) return;

    const sock = getSocket(userId);
    setSocket(sock);

    sock.on("getOnlineUser", (users) => {
      setOnline(users);
    });

    sock.on("newMessageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
      handleSuccess(`Message from ${msg.senderName}`);
    });

    sock.on("newChat", (chat) => {
      setUsers((prev) =>
        prev?.map((u) =>
          u._id === chat._id ? { ...u, newMessage: [...u.newMessage, chat] } : u
        )
      );
    });

    return () => {
      // ❌ DO NOT auto disconnect (prevents reconnect loop)
      sock.off("getOnlineUser");
      sock.off("newMessageReceived");
      sock.off("newChat");
    };
  }, [auth]);

  // 🔒 LOGOUT CLEANUP (important)
  useEffect(() => {
    if (!auth) {
      disconnectSocket();
      setSocket(null);
      setMessages([]);
      setOnline([]);
    }
  }, [auth]);

  return (
    <MessagingContext.Provider
      value={{
        socket,
        online,
        messages,
        setMessages,
        users,
        setUsers,
        auth,
        setAuth,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
