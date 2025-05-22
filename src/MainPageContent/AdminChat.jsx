import React, { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
      name
    }
  }
`;

const GET_MESSAGES_HISTORY = gql`
  query GetMessagesHistory($adminid: ID!, $studentid: ID!) {
    getAllMessagesByAdminAndStudent(adminid: $adminid, studentid: $studentid) {
      _id
      message
      time
      direction  # Added direction field
    }
  }
`;

function AdminChat() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const activeUser = JSON.parse(localStorage.getItem("active-user")); // Assume admin

  const { loading, error, data } = useQuery(GET_ALL_STUDENTS);

  const { loading: loadingMessages, error: messagesError, data: messagesData } = useQuery(
    GET_MESSAGES_HISTORY,
    {
      variables: {
        adminid: activeUser.id,
        studentid: selectedStudent,
      },
      skip: !selectedStudent,
    }
  );

  useEffect(() => {
    if (messagesData && messagesData.getAllMessagesByAdminAndStudent) {
      setMessages(messagesData.getAllMessagesByAdminAndStudent);
    }
  }, [messagesData]);

  useEffect(() => {
    if (data && data.getAllStudents.length > 0) {
      setSelectedStudent(data.getAllStudents[0]._id);
      setSelectedStudentName(data.getAllStudents[0].name);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedStudent) return;

    const token = localStorage.getItem("token");
    socketRef.current = new WebSocket(`ws://localhost:4000?token=${token}`);

    socketRef.current.onopen = () => {
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.from === selectedStudent) {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            direction: "student", 
          },
        ]);
      }
    };

    socketRef.current.onclose = () => {
    };

    return () => {
      socketRef.current.close();
    };
  }, [selectedStudent]);

  const changeChatAdmin = (studentId, studentName) => {
    setSelectedStudent(studentId);
    setSelectedStudentName(studentName);
    setMessages([]);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const now = new Date();
    const messagePayload = {
      to: selectedStudent,
      message: messageText,
      status: "sent",
      direction: "admin",
    };

    socketRef.current.send(JSON.stringify(messagePayload));

    setMessages((prev) => [
      ...prev,
      {
        from: activeUser.id,
        to: selectedStudent,
        message: messageText,
        time: now.toISOString(),
        status: "sent",
        direction: "admin",
      },
    ]);
    setMessageText("");
  };

  if (loading || loadingMessages) return <p>Loading...</p>;
  if (error) return <p>Error loading students: {error.message}</p>;
  if (messagesError) return <p>Error loading messages: {messagesError.message}</p>;

  return (
    <div className="min-h-[500px] flex gap-5">
      <div className="md:w-[250px] w-20">
        <h2 className="mb-[10px] font-bold text-xl">List of Students</h2>
        <ul>
          {data.getAllStudents.map((student) => (
            <li
              key={student._id}
              className="p-4 my-2 bg-[#333] cursor-pointer rounded-sm text-white"
              onClick={() => changeChatAdmin(student._id, student.name)}
            >
              {student.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-grow bg-[#2a2a2a] p-5 rounded-md border-2 border-[#333] h-[65vh] md:h-[80vh] mt-[65px] md:mt-[38px]">
        <div className="mb-3 md:mb-10 text-[18px]">
          Chatting with <b>{selectedStudentName}</b>...
        </div>

        <div className="flex flex-col gap-2 max-h-[82%] md:max-h-[80%] overflow-y-auto mb-4">
            {messages.map((msg, index) => (
                <div
                key={index}
                className={`flex flex-col gap-1 ${msg.direction === "admin" ? "items-end" : "items-start"}`}
                >
                <div
                    className={`p-2.5 rounded-3xl inline-block min-h-10 min-w-5 text-[16px] font-sans max-w-[70%] mr-4 ${
                    msg.direction === "admin" ? "bg-blue-500 text-white self-end pl-5 pr-5" : "bg-gray-700 text-white self-start pl-4 pr-4"
                    }`}
                >
                    {msg.message}
                </div>
                <div className="text-[8px] md:text-[12px] text-gray-400 mr-5">
                    {new Date(parseInt(msg.time)).toLocaleString()}
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

export default AdminChat;
