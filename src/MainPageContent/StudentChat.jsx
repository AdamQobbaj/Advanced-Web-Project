import React, { useState, useEffect } from 'react';

function StudentChat() {
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [messages, setMessages] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("active-user"));
        const adminList = JSON.parse(localStorage.getItem("admins")) || [];
        const allMessages = JSON.parse(localStorage.getItem("messages")) || [];

        setActiveUser(user);
        setAdmins(adminList);
    }, []);

    const changeChatStudent = (adminName) => {
        setSelectedAdmin(adminName);
        const studentName = JSON.parse(localStorage.getItem("active-user")).name;
        const allMessages = JSON.parse(localStorage.getItem("messages")) || [];

        const filteredMessages = allMessages.filter(
            (message) => message.admin === adminName && message.student === studentName
        );
        setMessages(filteredMessages);
    };

    return (
        <div className="chat-container">
            <div className="students-list">
                <h2>List of Admins</h2>
                <ul>
                    {admins.map((admin) => (
                        <li key={admin.id} onClick={() => changeChatStudent(admin.name)}>
                            {admin.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-box">
                <div className="chat-header">
                    Messages from <b id="message-from-admin">{selectedAdmin || "..."}</b>
                </div>
                {messages.map((msg) => (
                    <div className="chat-input" key={msg.id}>
                        <div>
                            <span>{msg.message}</span>
                            <h5>{msg.time}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentChat;
