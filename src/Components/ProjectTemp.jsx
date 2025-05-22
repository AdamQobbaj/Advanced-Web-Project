import React from "react";
import { useContext, useState } from "react";
 import { ProjectsContext } from '../contexts/projectsContext';


const ProjectTemp=({projectID , onClick })=>{
 
  const {projects, Setprojects} = useContext(ProjectsContext); 
  const [proBorder,setProBorder]=useState(false);
 
 
    const project= projects.find(p =>p.id==projectID);
    //console.log(projectID)

    //console.log(project)
    let statusBar="h-full text-center text-white "; 
    switch (project.status){
        case 'In Progress':
            statusBar+=" bg-gray-500";
            break;
        case 'Completed' :
            statusBar+="bg-blue-500 ";
            break; 
        default:
            break;      
    }
    let projectStudentsArray=project.students;
    let projectStudents="";
    projectStudentsArray.forEach(element => {
      projectStudents+=element+" , ";
    });
    projectStudents=projectStudents.slice(0, -3)


    const onClickHandller=(e)=>{
              
            onClick(e);
     }
  return(
 <>
         <div className={`flex-none basis-[350px] max-w-[350px] bg-[#444] p-[15px] rounded-[10px] border-2 h-[300px] 
    [&>*]:m-[10px] [&>*]:w-full border-transparent
  `} id={ "project-" + projectID} onClick={onClickHandller} >
          <h3 id="title" className="text-[#4285f4] font-bold text-[25px] truncate   text-xl">{project.name}</h3>
          <p id="Description" className=" h-[60px]   overflow-y-auto whitespace-normal break-words p-2   custom-scrollbar">
            <strong>Description:</strong> <span>{project.description}</span>
          </p>
          <p id="Students">
            <strong>Students:</strong> <span>{projectStudents}</span>
          </p>
          <p id="Category">
            <strong>Category:</strong> <span>{project.category}</span>
          </p>
          <div className="bg-gray-800 rounded-[5px] overflow-hidden h-5 my-2.5"  style={{
    width:
      project.status ==="In Progress"
        ? "50%"
        : project.status === "Completed"
        ? "100%"
        : "0%",
  }} id="progress">
            <div className={statusBar} >{(project.status==="In Progress"?"50":(project.status==="Completed"?100:0) )    +"%"}</div>
          </div>
          <p className="text-[14px] text-[#d3d3d3]" id="date">{project.startDate} - {project.endDate}</p>
        </div>
 </>

)
}
export default ProjectTemp;