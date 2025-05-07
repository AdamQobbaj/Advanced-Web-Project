import React from "react";
function AdminChat() {
    const [selectedStudent, setSelectedStudent] = React.useState("Ali Yaseen");
    const [messageText, setMessageText] = React.useState("");

    const activeUser = JSON.parse(localStorage.getItem("active-user"));
    const students = JSON.parse(localStorage.getItem("students")) || [];

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
        <div className="chat-container">
            <div className="students-list">
                <h2>List of Students</h2>
                <ul>
                    {students.map((student) => (
                        <li key={student.id} onClick={() => changeChatAdmin(student.name)}>
                            {student.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-box">
                <div className="chat-header">
                    Chatting with <b id="message-to-student">{selectedStudent}</b>...
                </div>
                <div className="chat-message">Salam Alykoum</div>
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        id="message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}


export default AdminChat;