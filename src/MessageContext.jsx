import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { handleSuccess } from "./utils";

export const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const socketRef = useRef(null); // 🔥 IMPORTANT
  const [online, setOnline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useState(false);
  const [users, setUsers] = useState([]);

  const userId = localStorage.getItem("userId");

  // 🔐 AUTH CHECK (RUN ONCE)
  useEffect(() => {
    const authenticate = async () => {
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/check-auth?userId=${userId}`,
          { headers: { Authorization: token } }
        );
        const result = await response.json();
        setAuth(result.success);
      } catch (error) {
        console.error("Auth error:", error);
        setAuth(false);
      }
    };

    authenticate();
  }, []); // ✅ removed auth dependency

  // 🔌 SOCKET INIT (ONCE AFTER AUTH)
  useEffect(() => {
    if (!auth || !userId || socketRef.current) return;

    const socket = io(import.meta.env.VITE_BASE_RENDER_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("getOnlineUser", setOnline);

    socket.on("newMessage", handleNewMessage);
    socket.on("newChat", handleNewChat);
    socket.on("newMessageReceived", handleChat);

    return () => {
      socket.off("getOnlineUser");
      socket.off("newMessage", handleNewMessage);
      socket.off("newChat", handleNewChat);
      socket.off("newMessageReceived", handleChat);
      // ❌ DO NOT DISCONNECT HERE
    };
  }, [auth]);

  // 🔒 DISCONNECT ONLY ON LOGOUT
  useEffect(() => {
    if (!auth && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setMessages([]);
      setOnline([]);
    }
  }, [auth]);

  // 🔔 HANDLERS (same logic as before)
  const handleNewMessage = (newMessage) => {
    if (
      newMessage?.senderId === localStorage.getItem("receiverId") &&
      newMessage?.receiverId === localStorage.getItem("userId")
    ) {
      setMessages((prev) => [...prev, newMessage]);
    }

    new Audio("/notification.mp3").play();
    handleSuccess(`message from ${newMessage.senderName}`);
  };

  const handleNewChat = (newMessage) => {
    updateUserMessages(newMessage);
  };

  const handleChat = (newMessage) => {
    updateUserMessages(newMessage);
    setMessages((prev) => [...prev, newMessage]);
  };

  const updateUserMessages = (newMessage) => {
    setUsers((prevUsers) =>
      prevUsers?.map((user) => ({
        ...user,
        newMessage: [
          ...user?.newMessage?.filter((msg) => msg?._id !== newMessage?._id),
          newMessage,
        ],
      }))
    );
  };

  return (
    <MessagingContext.Provider
      value={{
        socket: socketRef.current,
        online,
        messages,
        setMessages,
        auth,
        setAuth,
        users,
        setUsers,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
