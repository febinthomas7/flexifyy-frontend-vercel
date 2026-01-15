import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import Header from "../../components/Header";
import { PiCamera } from "react-icons/pi";
import { Helmet } from "react-helmet";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MessagingContext } from "../../MessageContext";
import { RxCross1 } from "react-icons/rx";
import {
  LoadingComponentForchatUsers,
  LoadingComponentForchatMessages,
} from "../../components/LoadingComponent";
import { getSocket } from "../../socket";
import { ToastContainer } from "react-toastify";
const MessagingPage = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [flags, setFlags] = useState(false);
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFriend, setUpdateFriend] = useState(false);
  const [photo, setPhoto] = useState("");

  const { messages, setMessages, online, users, setUsers } =
    useContext(MessagingContext);
  const socket = getSocket(localStorage.getItem("userId"));

  const no_image = "/no_image.svg";
  const userData = async () => {
    setLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_BASE_RENDER_URL
      }/chat/getusers?id=${localStorage.getItem("userId")}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setUsers(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    userData();
  }, [updateFriend]);
  const updateUserMessages = (userId, newMessage) => {
    setUsers((prevUsers) =>
      prevUsers?.map((user) => {
        return user._id === userId
          ? {
              ...user,
              newMessage: [
                ...user?.newMessage?.filter(
                  (msg) => msg._id !== newMessage._id // Prevent duplicate messages
                ),
                newMessage,
              ],
            }
          : user;
      })
    );
  };

  const selectUser = async (userId) => {
    try {
      const url = `${
        import.meta.env.VITE_BASE_RENDER_URL
      }/chat/user?id=${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.data._id == undefined) {
        setReceiverId("");
        localStorage.setItem("receiverId", []);
      } else {
        setReceiverId(result.data._id);
        localStorage.setItem("receiverId", result.data._id);
      }

      setUser(result.data);

      localStorage.setItem("receiverName", result.data.name);
      localStorage.setItem("receiverDp", result.data.dp);
      setHide(!hide);
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    setSendLoader(true);
    if (message == "" && !e.target.image.files[0]) {
      setSendLoader(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", e.target.image.files[0]);
    formData.append("message", message);
    formData.append("senderId", localStorage.getItem("userId"));
    formData.append("senderName", localStorage.getItem("name"));

    formData.append(
      "receiverId",
      receiverId || localStorage.getItem("receiverId")
    );
    formData.append("userId", localStorage.getItem("userId"));

    fetch(`${import.meta.env.VITE_BASE_RENDER_URL}/chat/sendmessage`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        const { success } = result;

        setMessage("");
        e.target.image.value = "";
        setSelectedFile("");

        if (success) {
          // setMessages([...messages, result?.newMessage]);
          setSendLoader(false);
        }

        socket.emit("newMessage", result?.newMessage);

        setFlags(!flags);
        if (result?.newFriend) {
          setUpdateFriend(result?.newFriend);
          console.log(result?.newFriend);
        }

        updateUserMessages(localStorage.getItem("receiverId"), result?.newChat);
      })
      .catch((error) => {
        console.error("Error:", error);
        setSendLoader(false);
      });
  };

  const getMessage = async () => {
    if (!receiverId || !localStorage.getItem("receiverId")) {
      return;
    }
    setChatLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_BASE_RENDER_URL
      }/chat/getmessage?receiverId=${
        receiverId || localStorage.getItem("receiverId")
      }&senderId=${localStorage.getItem("userId")}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      const { success, message, chatId } = result;
      if (success) {
        setMessages(message);
        setChatLoading(false);
      }
      if (!success) {
        setMessages([]);
        setChatLoading(false);
      }
    } catch (error) {
      console.log(error);
      setChatLoading(false);
    }
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    getMessage();
  }, [receiverId]);

  const filteredChats = useMemo(
    () =>
      users
        ?.filter((chat) =>
          chat?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        ?.slice(0, 5),
    [searchTerm]
  );

  const handleInputChange = (e) => setMessage(e.target.value);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const zoomIn = (pic) => {
    console.log(pic);
    setPhoto(pic);
  };

  const zoomOut = () => {
    setPhoto("");
  };
  return (
    <>
      <Helmet>
        <title>Chat - Flexifyy</title>
        <meta name="description" content="user chat" />
      </Helmet>
      <ToastContainer />
      <Header />
      <div className=" bg-black w-full  h-screen flex overflow-hidden ">
        <div
          className={`w-[400px] bg-[#020202] flex flex-col gap-2 overflow-auto ${
            !hide ? "flex" : "hidden sm:flex"
          }  relative pb-2 h-[calc(100%-5rem)] sm:h-[calc(100%-6rem)] px-2 mt-[5rem] sm:mt-[6rem] `}
        >
          <div className="gap-2 flex flex-col ">
            <input
              type="text"
              placeholder="Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="  p-2 rounded-lg bg-white text-gray-700 outline-none sticky "
            />

            {filteredChats?.length === 0 && (
              <div className="text-gray-400 text-center">No users found.</div>
            )}

            {users?.length === 0 && (
              <div className="text-gray-400 text-center">
                You don't have any friends yet.
              </div>
            )}

            {filteredChats?.map((chat, index) => (
              <div
                key={index}
                onClick={() => selectUser(chat._id)}
                className={`w-full rounded p-2 flex gap-2 ${
                  chat._id == localStorage.getItem("receiverId")
                    ? "bg-[#c4c4c475]"
                    : "bg-[#6f6f6f75]"
                } ${
                  searchTerm === "" || searchTerm === null ? "hidden" : ""
                } items-center cursor-pointer sm:hover:scale-105`}
              >
                <div className=" max-w-[20%]">
                  <img
                    src={chat.dp || no_image}
                    onError={(e) => {
                      e.target.src = no_image;
                    }}
                    alt="/no_image.jpg"
                    className={`rounded-full w-9 h-9 object-contain bg-black outline outline-2 outline-offset-2  ${
                      online.includes(chat?._id)
                        ? "outline-[green]"
                        : "outline-[red]"
                    }`}
                  />
                </div>

                <div className="flex flex-col p-1 w-full text-white max-w-[80%]">
                  <div className="w-full flex justify-between items-center">
                    <h1 title={chat?.name} className="text-sm">
                      {chat?.name}
                    </h1>{" "}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {loading && <LoadingComponentForchatUsers />}
          {users
            ?.filter((usr, i) =>
              usr.friends?.includes(localStorage.getItem("userId"))
            )
            ?.map((e, index) => {
              return (
                <div
                  key={index}
                  onClick={() => selectUser(e._id)}
                  className={`w-full rounded p-2 flex gap-2 ${
                    e._id == localStorage.getItem("receiverId")
                      ? "bg-[#c4c4c475]"
                      : "bg-[#3939397d]"
                  }  ${
                    searchTerm === "" ||
                    searchTerm === null ||
                    searchTerm === undefined
                      ? ""
                      : "hidden"
                  }  items-center cursor-pointer sm:hover:scale-105`}
                >
                  <div className="max-w-[20%]">
                    <img
                      src={e?.dp || no_image}
                      onError={(e) => {
                        e.target.src = no_image;
                      }}
                      alt="/no_image.jpg"
                      className={`rounded-full w-9 h-9 object-contain outline outline-2 outline-offset-2 ${
                        online.includes(e?._id)
                          ? "outline-[green]"
                          : "outline-[red]"
                      } bg-black`}
                    />
                  </div>

                  <div className="flex flex-col p-1 min-w-[80%] max-w-[80%] text-white">
                    <div className="w-full min-w-[100%] max-w-[100%] flex justify-between items-center">
                      <h1 className="text-sm">{e?.name}</h1>{" "}
                    </div>
                    <div className="w-full flex justify-between items-center text-sm">
                      {e?.newMessage
                        ?.filter(
                          (usr) =>
                            usr.participants?.includes(
                              localStorage.getItem("userId")
                            ) && usr.participants?.includes(e?._id) // Check if senderId is in participants and there are other users
                        )
                        ?.map((filteredMessage, index) => {
                          const dateObject = new Date(
                            filteredMessage?.updatedAt
                          );

                          // Get hours and minutes
                          let hours = dateObject.getHours();
                          const minutes = dateObject
                            .getMinutes()
                            .toString()
                            .padStart(2, "0");

                          // Determine AM or PM
                          const ampm = hours >= 12 ? "PM" : "AM";

                          // Convert hours to 12-hour format and remove leading zero
                          hours = hours % 12 || 12;

                          const formattedTime = `${hours}:${minutes} ${ampm}`;
                          return (
                            <div
                              key={index}
                              className="w-full flex justify-between items-center"
                            >
                              <h1 className="truncate min-w-[76%] max-w-[76%]">
                                {filteredMessage?.latestMessage}
                              </h1>
                              <span className="text-xs max-w-[24%]">
                                {formattedTime}
                              </span>
                            </div>
                            // Display the filtered message
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div
          className={`w-full h-[calc(100%-5rem)] sm:h-[calc(100%-6rem)] bg-black relative mt-[5rem] sm:mt-[6rem] ${
            hide ? "flex" : "hidden sm:flex"
          }  sm:flex`}
        >
          {(receiverId || localStorage.getItem("receiverId")) && (
            <div className=" top-0 left-0 z-10 w-full h-[50px] absolute bg-[#151515] flex justify-between items-center py-4 px-1 ">
              <div className="flex justify-center gap-3 items-center text-white">
                <RiArrowLeftSLine
                  onClick={() => setHide(!hide)}
                  className="text-2xl sm:hidden"
                />
                <img
                  src={user?.dp || localStorage.getItem("receiverDp")}
                  onError={(e) => {
                    e.target.src = no_image;
                  }}
                  alt=""
                  className="w-6 h-6 bg-white rounded-full object-contain"
                />
                <h1>{user?.name || localStorage.getItem("receiverName")}</h1>
              </div>
            </div>
          )}

          <div
            className=" w-full h-full overflow-auto hide py-16  bg-[url('/bgforchat.png')] bg-cover bg-center bg-no-repeat "
            id="scroll-container"
          >
            {!photo == "" && (
              <div className="w-full h-full flex justify-center items-center bg-[#000000b0] z-[8] absolute top-0">
                <RxCross1
                  onClick={zoomOut}
                  className="right-6 top-[80px] absolute text-white cursor-pointer "
                />
                <img
                  src={photo}
                  alt="chat photo"
                  className="w-[250px] sm:w-[300px] h-auto object-cover rounded-lg"
                />
              </div>
            )}
            {chatLoading && <LoadingComponentForchatMessages />}
            {messages.length <= 0 &&
              !chatLoading &&
              localStorage.getItem("receiverId") && (
                <div className="text-center text-white">No messages yet.</div>
              )}

            {!localStorage.getItem("receiverId") && (
              <div className="text-center text-black  text-xl">
                Chat and share moments with your friends!
              </div>
            )}
            {messages?.map((msg, index) => {
              const dateObject = new Date(msg?.updatedAt);

              // Get hours and minutes
              let hours = dateObject.getHours();
              const minutes = dateObject
                .getMinutes()
                .toString()
                .padStart(2, "0");

              // Determine AM or PM
              const ampm = hours >= 12 ? "PM" : "AM";

              // Convert hours to 12-hour format and remove leading zero
              hours = hours % 12 || 12;

              const formattedTime = `${hours}:${minutes} ${ampm}`;

              // Regular expression to match URLs
              const urlRegex = /(https?:\/\/[^\s]+)/g;

              const parts = msg?.message.split(urlRegex);
              return (
                <div
                  key={index}
                  ref={messagesEndRef}
                  className={`p-2 ${
                    msg?.senderId === localStorage.getItem("userId")
                      ? "text-right"
                      : ""
                  }`}
                >
                  <div>
                    <div
                      className={` rounded-xl break-words text-white px-2 pt-3 pb-4 inline-block relative min-w-[50px] max-w-[200px] sm:max-w-[250px] text-left overflow-hidden ${
                        msg?.senderId === localStorage.getItem("userId")
                          ? "bg-[#181818af] rounded-xl rounded-br-none"
                          : " bg-[#3d3d3daf] rounded-xl rounded-bl-none"
                      }`}
                    >
                      {msg?.imageUrl && (
                        <img
                          className="w-full cursor-pointer"
                          src={msg?.imageUrl}
                          onClick={() => zoomIn(msg?.imageUrl)}
                          onError={(e) => {
                            e.target.src = "/fallback_poster.png";
                          }}
                          alt={msg?.imageUrl}
                        />
                      )}

                      {parts.map((part, idx) => {
                        // Check if the part is a URL
                        if (urlRegex.test(part)) {
                          return (
                            <a
                              key={idx}
                              href={part}
                              rel="noopener noreferrer"
                              className="text-blue-400 underline"
                            >
                              {part}
                            </a>
                          );
                        } else {
                          // Render plain text
                          return (
                            <span key={idx} className="">
                              {part}
                            </span>
                          );
                        }
                      })}
                      <span className="text-[10px] absolute text-gray-400  bottom-0 right-1">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {(receiverId || localStorage.getItem("receiverId")) && (
            <form
              onSubmit={sendMessage}
              className="flex gap-2  p-3 absolute  bottom-0 left-0 w-full bg-[#00000096]"
            >
              <input
                type="text"
                className="border p-2 flex-1 rounded-md"
                value={message}
                name="message"
                onChange={handleInputChange}
                placeholder="Type a message..."
              />
              <input
                type="file"
                className="hidden"
                id="fileInput"
                name="image"
                onChange={handleFileChange} // handle file selection
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer bg-blue-500 text-[20px] text-white px-2 py-2 flex justify-center items-center rounded"
              >
                <PiCamera />
              </label>
              <button
                // onClick={sendMessage}
                type="submit"
                disabled={message == "" && !selectedFile}
                className={` ${
                  message == "" && !selectedFile
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-red-700"
                } text-white px-4 py-2 rounded`}
              >
                {sendLoader ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagingPage;
