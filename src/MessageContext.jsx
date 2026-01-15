import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { handleSuccess } from "./utils";

export const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useState(false); // Default to not authenticated
  const [users, setUsers] = useState();
  const userId = localStorage.getItem("userId");

  // Authenticate user
  useEffect(() => {
    const authenticate = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) return; // Skip if no user is logged in

      try {
        const url = `${
          import.meta.env.VITE_BASE_URL
        }/auth/check-auth?userId=${userId}`;
        const headers = {
          Authorization: token,
        };
        const response = await fetch(url, { headers });

        const result = await response.json();
        if (result.success) {
          setAuth(true); // User is authenticated
        } else {
          // If authentication fails, clear localStorage and handle socket cleanup
          await fetch(`${import.meta.env.VITE_BASE_URL}/auth/device-logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          localStorage.clear();
          setAuth(false); // User is no longer authenticated

          // Cleanup socket if it exists
          if (socket) {
            socket.disconnect();
            setSocket(null); // Reset socket state
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);

        // Handle socket cleanup on error as well
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      }
    };

    authenticate();
  }, [auth]);

  // Initialize socket connection
  useEffect(() => {
    if (!auth || !userId) return;

    if (!socket) {
      const newSocket = io(import.meta.env.VITE_BASE_RENDER_URL, {
        query: { userId },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUser", (onlineUsers) => {
        setOnline(onlineUsers);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null); // Reset the socket state on unmount
      };
    }

    // If socket already exists, no new connection is created
    return () => {
      if (!auth || !userId) {
        socket?.disconnect();
        setSocket(null);
      }
    };
  }, [auth]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;
    // console.log(socket);

    const handleNewMessage = (newMessage) => {
      if (
        newMessage?.senderId === localStorage.getItem("receiverId") &&
        newMessage?.receiverId === localStorage.getItem("userId")
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      const audio = new Audio("/notification.mp3");
      audio.play();

      handleSuccess(`message from ${newMessage.senderName}`);
    };

    const handleNewChat = (newMessage) => {
      updateUserMessages(newMessage);
    };

    const handleChat = (newMessage) => {
      updateUserMessages(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newChat", handleNewChat);
    socket.on("newMessageReceived", handleChat);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newChat", handleNewChat);
      socket.off("newMessageReceived", handleChat);
    };
  }, [socket]);

  const updateUserMessages = (newMessage) => {
    setUsers((prevUsers) =>
      prevUsers?.map((user) => ({
        ...user,
        newMessage: [
          ...user?.newMessage?.filter(
            (msg) => msg?._id !== newMessage?._id // Prevent duplicate messages
          ),
          newMessage,
        ],
      }))
    );
  };

  return (
    <MessagingContext.Provider
      value={{
        socket,
        setSocket,
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
