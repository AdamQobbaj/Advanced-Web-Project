import { createContext, useState } from "react"

const ProjectDataContext=createContext();
const ProjectDataProvider=({children})=>{
    const [projectData, setProjectData] = useState(-1);
    return(
        <ProjectDataContext.Provider value={{projectData,setProjectData}}>
            {children}
        </ProjectDataContext.Provider>
    );


}
export {ProjectDataContext,ProjectDataProvider}