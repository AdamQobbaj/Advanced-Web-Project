import { useContext, useState } from "react";
import { CurrentMainContentContext } from '../contexts/currentMainContent';
import { CurrentPageContext } from '../contexts/currentPage';
import { ProjectDataContext } from '../contexts/projectDataContext';
import { UpdateProjectContext } from '../contexts/updateProjectContext ';


import Signin from "./signin";
import AdminHome from "../MainPageContent/AdminHome";
import StudentHome from "../MainPageContent/StudentHome";
import AdminProjects from "../MainPageContent/AdminProjects";
import StudentProjects from "../MainPageContent/StudentProjects";
import AdminTasks from "../MainPageContent/AdminTasks";
import StudentTasks from "../MainPageContent/StudentTasks";
import AdminChat from "../MainPageContent/AdminChat";
import StudentChat from "../MainPageContent/StudentChat";
import ProjectDataTemp from '../Components/ProjectDataTemp';
import AddProgectTemp from '../Components/AddProjectTemp';
 import UpdateProjectTemp from '../Components/UpdateProjectTemp';


function MainPage () {
  const { currentMainContent, setCurrentMainContent } = useContext(CurrentMainContentContext);
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext);
  const storgaeActiveTab = localStorage.getItem("active-tab");
  const [activeTab, setActiveTab] = useState(storgaeActiveTab);
    const {projectData, setProjectData } = useContext(ProjectDataContext);
    const {updateProjectID, setUpdateProjectID} = useContext(UpdateProjectContext);


  const activeUser = JSON.parse(localStorage.getItem("active-user"));

  function logout() {
    localStorage.setItem("active-user", JSON.stringify({ name: "", id: "" }));
    localStorage.setItem("stay-signed-in", "false");
    setCurrentPage(<Signin />);
  }

  function loadHomeContent() {
    setActiveTab("home");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminHome /> : <StudentHome />);
    localStorage.setItem("active-tab", "home");
  }

  function loadProjectsContent() {
    setActiveTab("projects");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminProjects /> : <StudentProjects />);
    localStorage.setItem("active-tab", "projects");
  }

  function loadTasksContent() {
    setActiveTab("tasks");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminTasks /> : <StudentTasks />);
    localStorage.setItem("active-tab", "tasks");
  }

  function loadChatContent() {
    setActiveTab("chat");
    setCurrentMainContent(activeUser.type === "admin" ? <AdminChat /> : <StudentChat />);
    localStorage.setItem("active-tab", "chat");
  }

  return (
    <>
      {/* Top Bar */}

      <div className="bg-[#181818] flex justify-end px-5 py-[15px] w-[95%] border-b-[3px] border-[#3a3a3a]">
        <div className="flex items-center gap-[15px]"> 
        <span id="name-span">{activeUser.type} {activeUser.name}</span>
        <button
          className="bg-red-500 text-white border-none px-4 py-2 cursor-pointer rounded-[5px]"
          onClick={logout}
        >
          Logout
        </button>
        </div>
      </div>




      {/* Navigation + Content */}
      <div className="flex flex-grow w-[98%] h-[90vh] relative mx-auto flex-col md:flex-row">
        {/* Navigation */}
          <div
    className="p-5 h-[15%] md:h-full bg-[#181818] border-r-2 border-[#3a3a3a] max-[800px]:w-full md:w-[250px]"
  >
    <ul className="list-none p-0 flex  max-[800px]:flex-row  max-[800px]:justify-around md:flex-col md:justify-start md:gap-2">
      <li
        onClick={loadHomeContent}
        className={`py-3 px-4 rounded-md cursor-pointer text-white ${
          activeTab === "home" ? "bg-[#4285f4]" : "bg-[#333]"
        } w-[16%] md:w-full text-center md:text-left my-2 md:my-0`}
      >
        Home
      </li>
      <li
        onClick={loadProjectsContent}
        className={`py-3 px-4 rounded-md cursor-pointer text-white ${
          activeTab === "projects" ? "bg-[#4285f4]" : "bg-[#333]"
        } w-[16%] md:w-full text-center md:text-left my-2 md:my-0`}
      >
        Projects
      </li>
      <li
        onClick={loadTasksContent}
        className={`py-3 px-4 rounded-md cursor-pointer text-white ${
          activeTab === "tasks" ? "bg-[#4285f4]" : "bg-[#333]"
        } w-[16%] md:w-full text-center md:text-left my-2 md:my-0`}
      >
        Tasks
      </li>
      <li
        onClick={loadChatContent}
        className={`py-3 px-4 rounded-md cursor-pointer text-white ${
          activeTab === "chat" ? "bg-[#4285f4]" : "bg-[#333]"
        } w-[16%] md:w-full text-center md:text-left my-2 md:my-0`}
      >
        Chat
      </li>
    </ul>
  </div>


        {/* Content Area */}
        <div className="flex-1 p-4">
          {currentMainContent}
        
        </div>

    <ProjectDataTemp/> 
  
      {activeUser.type==="admin" ?  <AddProgectTemp/>:<></> }
      {activeUser.type==="admin" && (parseInt(updateProjectID)>0) ?  <UpdateProjectTemp/>:<></> }

      </div>



    </>
  );
}

export default MainPage;
