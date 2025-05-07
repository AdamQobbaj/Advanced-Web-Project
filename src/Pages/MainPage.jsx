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

  function logout() {
    localStorage.setItem("active-user", JSON.stringify({ name: "", password: "", id: "", type: "" }));
    localStorage.setItem("stay-signed-in", "false");
    setCurrentPage(<Signin />);
  }

  function loadHomeContent() {
    setActiveTab("home");
    if (activeUser.type === "admin") {
      setCurrentMainContent(<AdminHome />);
    } else {
      setCurrentMainContent(<StudentHome />);
    }
  }

  function loadProjectsContent() {
    setActiveTab("projects");
    if (activeUser.type === "admin") {
      setCurrentMainContent(<AdminProjects />);
    } else {
      setCurrentMainContent(<StudentProjects />);
    }
  }

  function loadTasksContent() {
    setActiveTab("tasks");
    if (activeUser.type === "admin") {
      setCurrentMainContent(<AdminTasks />);
    } else {
      setCurrentMainContent(<StudentTasks />);
    }
  }

  function loadChatContent() {
    setActiveTab("chat");
    if (activeUser.type === "admin") {
      setCurrentMainContent(<AdminChat />);
    } else {
      setCurrentMainContent(<StudentChat />);
    }
  }

  return (
    <div>
      <div className="top-bar">
        <div className="admin-info">
          <span id="name-span">{activeUser.type} {activeUser.name}</span>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container">
        <div className="sidebar">
          <ul>
            <li onClick={loadHomeContent} className={activeTab === "home" ? "active" : ""}>Home</li>
            <li onClick={loadProjectsContent} className={activeTab === "projects" ? "active" : ""}>Projects</li>
            <li onClick={loadTasksContent} className={activeTab === "tasks" ? "active" : ""}>Tasks</li>
            <li onClick={loadChatContent} className={activeTab === "chat" ? "active" : ""}>Chat</li>
          </ul>
        </div>

        <div className="main-div" id="content">
          {currentMainContent}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
