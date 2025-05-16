import { createContext, useState } from "react"

const ProjectsContext=createContext();
const ProjectsProvider=({children})=>{
    const [projects, setProjects] = useState(JSON.parse(localStorage.getItem("projects")) || []);  

    return(
        <ProjectsContext.Provider value={{projects,setProjects}}>
            {children}
        </ProjectsContext.Provider>
    );


}
export {ProjectsContext,ProjectsProvider}