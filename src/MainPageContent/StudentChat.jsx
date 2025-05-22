import React, { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_ALL_ADMINS = gql`
  query GetAllAdmins {
    getAllAdmins {
      _id
      name
    }
  }
`;

const GET_MESSAGES_HISTORY = gql`
  query GetMessagesHistory($studentid: ID!, $adminid: ID!) {
    getAllMessagesByAdminAndStudent(studentid: $studentid, adminid: $adminid) {
      _id
      message
      time
      direction  # Added direction field
    }
  }
`;

function StudentChat() {
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedAdminName, setSelectedAdminName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const activeUser = JSON.parse(localStorage.getItem("active-user"));

  const { loading, error, data } = useQuery(GET_ALL_ADMINS);

  const { loading: loadingMessages, error: messagesError, data: messagesData } = useQuery(
    GET_MESSAGES_HISTORY,
    {
      variables: {
        studentid: activeUser.id,
        adminid: selectedAdmin,
      },
      skip: !selectedAdmin,
    }
  );

  useEffect(() => {
    if (messagesData && messagesData.getAllMessagesByAdminAndStudent) {
      setMessages(messagesData.getAllMessagesByAdminAndStudent);
    }
  }, [messagesData]);

  useEffect(() => {
    if (data && data.getAllAdmins.length > 0) {
      setSelectedAdmin(data.getAllAdmins[0]._id);
      setSelectedAdminName(data.getAllAdmins[0].name);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedAdmin) return;

    const token = localStorage.getItem("token");
    socketRef.current = new WebSocket(`ws://localhost:4000?token=${token}`);

    socketRef.current.onopen = () => {
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.from === selectedAdmin) {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            direction: "admin", 
          },
        ]);
      }
    };

    socketRef.current.onclose = () => {
    };

    return () => {
      socketRef.current.close();
    };
  }, [selectedAdmin]);

  const changeChatStudent = (adminId, adminName) => {
    setSelectedAdmin(adminId);
    setSelectedAdminName(adminName);
    setMessages([]);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const now = new Date();
    const messagePayload = {
      to: selectedAdmin, 
      message: messageText,
      status: "sent",
      direction: "student", 
    };

    socketRef.current.send(JSON.stringify(messagePayload));

    setMessages((prev) => [
      ...prev,
      {
        from: activeUser.id,
        to: selectedAdmin,
        message: messageText,
        time: now.toISOString(),
        status: "sent",
        direction: "student", 
      },
    ]);
    setMessageText("");
  };

  if (loading || loadingMessages) return <p>Loading...</p>;
  if (error) return <p>Error loading admins: {error.message}</p>;
  if (messagesError) return <p>Error loading messages: {messagesError.message}</p>;

  return (
    <div className="min-h-[500px] flex gap-5">
      <div className="md:w-[250px] w-20">
        <h2 className="mb-[10px] font-bold text-xl">List of Admins</h2>
        <ul>
          {data.getAllAdmins.map((admin) => (
            <li
              key={admin._id}
              className="p-4 my-2 bg-[#333] cursor-pointer rounded-sm text-white"
              onClick={() => changeChatStudent(admin._id, admin.name)}
            >
              {admin.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-grow bg-[#2a2a2a] p-5 rounded-md border-2 border-[#333] h-[65vh] md:h-[80vh] mt-[65px] md:mt-[38px]">
        <div className="mb-3 md:mb-10 text-[18px]">
          Chatting with <b>{selectedAdminName}</b>...
        </div>

        <div className="flex flex-col gap-2 max-h-[82%] md:max-h-[80%] overflow-y-auto mb-4">
            {messages.map((msg, index) => (
                <div
                key={index}
                className={`flex flex-col gap-1 ${msg.direction === "admin" ? "items-end" : "items-start"}`}
                >
                <div
                    className={`p-2.5 rounded-3xl inline-block min-h-10 min-w-5 text-[16px] font-sans max-w-[70%] mr-4 ${
                    msg.direction === "student" ? "bg-blue-500 text-white self-end pl-5 pr-5" : "bg-gray-700 text-white self-start pl-4 pr-4"
                    }`}
                >
                    {msg.message}
                </div>
                <div className={`text-[8px] md:text-[12px] text-gray-400 ${msg.direction === "admin" ? "self-start" : "self-end mr-5"}`}>                    {new Date(parseInt(msg.time)).toLocaleString()}
                </div>
                </div>
            ))}
        </div>

        <div className="flex gap-[10px] mt-[10px]">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full p-2.5 bg-[#333] text-white rounded-3xl border-1 border-[#666] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2.5 bg-[#28a745] text-white border-none rounded-3xl cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentChat;
