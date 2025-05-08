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
        <div className="min-h-[500px] flex gap-5r">
            <div className="md:w-[250px] w-20">
                <h2 className="mb-[10px] font-bold text-xl">List of Admins</h2>
                <ul>
                    {admins.map((admin) => (
                        <li key={admin.id} onClick={() => changeChatStudent(admin.name)} className="p-4 my-2 bg-[#333] cursor-pointer rounded-sm text-white">
                            {admin.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-grow bg-[#2a2a2a] ml-3 p-5 rounded-md border-2 border-[#333] h-[25%] mt-[65px] md:mt-[38px]">
                <div className="mb-3 md:mb-10 text-[18px]">
                    Messages from <b id="message-from-admin">{selectedAdmin || "..."}</b>
                </div>
                { messages.length === 0 && (
                    <div className="text-center text-gray-500">No messages yet</div>
                )}
                {
                messages.map((msg) => (
                    <div className="w-full p-2.5 bg-[#333] text-white rounded-md border-1 border-[#666] focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" key={msg.id}>
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
