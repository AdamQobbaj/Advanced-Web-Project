import React from "react";
function AdminChat() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const [selectedStudent, setSelectedStudent] = React.useState(students[0]?.name || "");
    const [messageText, setMessageText] = React.useState("");

    const activeUser = JSON.parse(localStorage.getItem("active-user"));

    const changeChatAdmin = (studentName) => {
        setSelectedStudent(studentName);
    };

    const sendMessage = () => {
        let messages = JSON.parse(localStorage.getItem("messages")) || [];
        let id = messages.length + 1;
        let now = new Date();
        let timeString = new Intl.DateTimeFormat('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
        }).format(now);

        messages.push({
            id,
            admin: activeUser.name,
            student: selectedStudent,
            message: messageText,
            time: timeString
        });

        localStorage.setItem("messages", JSON.stringify(messages));
        setMessageText(""); 
    };

    return (
        <div className="min-h-[500px] flex gap-5">
            <div className="md:w-[250px] w-20">
                <h2 className="mb-[10px] font-bold text-xl">List of Students</h2>   
                <ul>
                    {students.map((student) => (
                        <li className="p-4 my-2 bg-[#333] cursor-pointer rounded-sm text-white"
                        key={student.id} onClick={() => changeChatAdmin(student.name)}>
                            {student.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-grow bg-[#2a2a2a] p-5 rounded-md border-2 border-[#333] h-[25%] mt-[65px] md:mt-[38px]">
                <div className="mb-3 md:mb-10 text-[18px]">
                    Chatting with <b id="message-to-student">{selectedStudent}</b>...
                </div>
                <div className="bg-[#28a745] text-white p-2.5 rounded-sm inline-block mb-2.5 gap-5 max-w-full">Salam Alykoum</div>
                <div className="flex gap-[10px] mt-[10px]">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        id="message"
                        className="w-full p-2.5 bg-[#333] text-white rounded-md border-1 border-[#666] focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button onClick={sendMessage} className="px-4 py-2.5 bg-[#28a745] text-white border-none rounded-md cursor-pointer">Send</button>
                </div>
            </div>
        </div>
    );
}


export default AdminChat;