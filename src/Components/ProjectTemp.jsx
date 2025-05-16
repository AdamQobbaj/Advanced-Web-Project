import React from "react";
import { useContext, useState } from "react";
 import { ProjectsContext } from '../contexts/projectsContext';


const ProjectTemp=({projectID , onClick })=>{
 
  const {projects, Setprojects} = useContext(ProjectsContext); 
  const students = JSON.parse(localStorage.getItem("students")) || [];

    const project= projects.find(p =>p.id==projectID);
    //console.log(projectID)

    //console.log(project)
    let statusBar="h-full text-center text-white bg-blue-500 "; 
    switch (project.status){
        case 'In Progress':
            statusBar+="partial";
            break;
        case 'Completed' :
            statusBar+=" bg-gray-500";
            break; 
        default:
            break;      
    }
    let projectStudentsArray=students.filter(s=> project.students.includes(s.id)).map(ss=>ss.name);
    let projectStudents="";
    projectStudentsArray.forEach(element => {
      projectStudents+=element+" , ";
    });
    projectStudents=projectStudents.slice(0, -3)
  return(
 <>
         <div className="flex-none basis-[350px] bg-[#444] p-[15px] rounded-[10px] border-2 border-transparent   
         [&>*]:m-[10px] h-[50%] [&>*]:w-full
         " id={ "project-" + projectID} onClick={onClick} >
          <h3 id="title" className="text-[#4285f4] text-xl">{project.name}</h3>
          <p id="Description" className=" h-[60px] overflow-auto p-2   custom-scrollbar">
            <strong>Description:</strong> <span>{project.description}</span>
          </p>
          <p id="Students">
            <strong>Students:</strong> <span>{projectStudents}</span>
          </p>
          <p id="Category">
            <strong>Category:</strong> <span>{project.category}</span>
          </p>
          <div className="bg-gray-800 rounded-[5px] overflow-hidden h-5 my-2.5"  style={{width:project.percentage+"%"}} id="progress">
            <div className={statusBar} >{project.percentage+"%"}</div>
          </div>
          <p className="text-[14px] text-[#d3d3d3]" id="date">{project.startDate} - {project.endDate}</p>
        </div>
 </>

)
}
export default ProjectTemp;