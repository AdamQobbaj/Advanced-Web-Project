import { useContext, useState } from "react";
import { CurrentMainContentContext } from '../contexts/currentMainContent';
import { CurrentPageContext } from '../contexts/currentPage';

import Signin from "./Signin";
import AdminHome from "../MainPageContent/AdminHome";
import StudentHome from "../MainPageContent/StudentHome";
import AdminProjects from "../MainPageContent/AdminProjects";
import StudentProjects from "../MainPageContent/StudentProjects";
import AdminTasks from "../MainPageContent/AdminTasks";
import StudentTasks from "../MainPageContent/StudentTasks";
import AdminChat from "../MainPageContent/AdminChat";
import StudentChat from "../MainPageContent/StudentChat";

function MainPage () {
  const { currentMainContent, setCurrentMainContent } = useContext(CurrentMainContentContext);
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext);
  const [activeTab, setActiveTab] = useState("home");

  const activeUser = JSON.parse(localStorage.getItem("active-user"));
  const activeUserText = activeUser.type.charAt(0).toUpperCase() + activeUser.type.slice(1);

  function logout() {
    localStorage.setItem("active-user", JSON.stringify({ name: "", password: "", id: "", type: "" }));
    localStorage.setItem("stay-signed-in", "false");
    setCurrentPage(<Signin />);
  }

  function loadHomeContent() {
    setActiveTab("home");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminHome /> : <StudentHome />);
  }

  function loadProjectsContent() {
    setActiveTab("projects");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminProjects /> : <StudentProjects />);
  }

  function loadTasksContent() {
    setActiveTab("tasks");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminTasks /> : <StudentTasks />);
  }

  function loadChatContent() {
    setActiveTab("chat");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminChat /> : <StudentChat />);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="bg-[#181818] flex justify-between items-center p-3  border-b-[3px] border-[#666666] min-w-screen">
        <div className="text-white text-sm">{activeUserText} {activeUser.name}</div>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Navigation + Content */}
      <div className="flex flex-col md:flex-row flex-grow mx-w-full">
        {/* Navigation */}
        <div
        className=" h-[5%] md:h-190 md:w-[20%] h-20 md:w-[250px] bg-gradient-to-b from-[#222222] to-[#333333] border-r-[2px]"
        >
          <ul className="flex md:flex-col gap-2 md:m-5 p-2 text-white">
            <li
              onClick={loadHomeContent}
              className={`flex-1 text-center py-3 px-4 my-2 rounded-md cursor-pointer ${activeTab === "home" ? "bg-blue-600" : "bg-[#666666]"}`}
            >
              Home
            </li>
            <li
              onClick={loadProjectsContent}
              className={`flex-1 text-center py-3 px-4 my-2 rounded-md cursor-pointer ${activeTab === "projects" ? "bg-blue-600" : "bg-[#666666]"}`}
            >
              Projects
            </li>
            <li
              onClick={loadTasksContent}
              className={`flex-1 text-center py-3 px-4 my-2 rounded-md cursor-pointer ${activeTab === "tasks" ? "bg-blue-600" : "bg-[#666666]"}`}
            >
              Tasks
            </li>
            <li
              onClick={loadChatContent}
              className={`flex-1 text-center py-3 px-4 my-2 rounded-md cursor-pointer ${activeTab === "chat" ? "bg-blue-600" : "bg-[#666666]"}`}
            >
              Chat
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 overflow-auto bg-[#1e1e1e]">
          {currentMainContent}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
