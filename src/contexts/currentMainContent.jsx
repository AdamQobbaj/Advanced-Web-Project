import { createContext, useState } from "react"

import AdminHome from "../MainPageContent/AdminHome";
import StudentHome from "../MainPageContent/StudentHome";
import AdminProjects from "../MainPageContent/AdminProjects";
import StudentProjects from "../MainPageContent/StudentProjects";
import AdminTasks from "../MainPageContent/AdminTasks";
import StudentTasks from "../MainPageContent/StudentTasks";
import AdminChat from "../MainPageContent/AdminChat";
import StudentChat from "../MainPageContent/StudentChat";

const CurrentMainContentContext = createContext();

const CurrentMainContentProvider = ({ children }) => {
    const type = JSON.parse(localStorage.getItem("active-user")).type;
    const activeTab = localStorage.getItem("active-tab");
    const initalPage = activeTab === "home" ? <AdminHome /> : activeTab === "projects" ? <AdminProjects /> : activeTab === "tasks" ? <AdminTasks /> : activeTab === "chat" ? <AdminChat /> : type === "admin" ? <AdminHome /> : <StudentHome />;


    const [currentMainContent, setCurrentMainContent] = useState(initalPage);
    return (
        <CurrentMainContentContext.Provider value={{ currentMainContent, setCurrentMainContent }}>
            {children}
        </CurrentMainContentContext.Provider>
    );
}

export {CurrentMainContentContext, CurrentMainContentProvider};