import { ProjectDataContext } from '../contexts/projectDataContext';
import { useContext, useState } from "react";
import { ProjectsContext } from '../contexts/projectsContext';


const ProjectDataTemp=({projectID})=>{
  const {projects, Setprojects} = useContext(ProjectsContext); 
  const students = JSON.parse(localStorage.getItem("students")) || [];
    const tasks=JSON.parse(localStorage.getItem("tasks")) || [];
    const project=projects.find(p=>p.id==projectID);
      const {projectData, setProjectData } = useContext(ProjectDataContext);
    
    //console.log(project);
    //console.log(projectID);


    const TaskTemp=({taskID})=>{
        const task=tasks.find(t=>t.id==taskID);
  
    return(
        
        <>
                <div className="bg-[#222] p-[10px] border border-[#00ff66] mb-[10px] rounded-[5px] h-[23vh] flex flex-col justify-between" >
                <strong  >Task ID: <span id="proTaskID">{task.id}</span> </strong>
                <p className="mb-auto"><strong>Task Name:</strong> <span id="proTaskName">{task.title}</span></p>
                <p className="mb-auto"><strong>Description:</strong> <span id="proTaskDescription">{task.description}</span></p>
                <p className="mb-auto"><strong>Assigned Student:</strong> <span id="proTaskStudent">{students.find(s=>s.id==task.students).name}</span></p>
                <p className="mb-auto"><strong>Status:</strong> <span id="proTaskStatus">{task.status}</span></p>
            </div>
        
        </>
    );
    }

    
    
    let projectStudentsArray=project? students.filter(s=> project.students.includes(s.id)).map(ss=>ss.name):[];
    let projectStudents="";
    projectStudentsArray.forEach(element => {
      projectStudents+=element+" , ";
    });
    projectStudents=projectStudents.slice(0, -3);

    let tasksDiv=project ? tasks.filter(t=>project.tasks.includes(t.id)).map(tt=>{
        return <TaskTemp  key={tt.id} taskID={tt.id} />
    }) : <></>;
    console.log( );

    let styleProData= projectID<0 ?"none":"block";

const outsideClickProData=(event)=>{
    const pro_deta = document.getElementById("ProDeta");
    let projects=document.getElementById("projects");
      let flage=true;
        if (event.target === pro_deta)  {
           Array.from(projects.children).forEach(project=>{
              if(project.contains(event.target))flage=false;
           });
           if(flage){
            setProjectData(-1)
              Array.from(projects.children).forEach(project=>{
              project.classList.remove("border-orange-500");
    
            });
  
           }
  
  
  
        }  
}



 
return(

<>
<div className="fixed top-0 left-0 w-full h-full z-[1000]   " id="ProDeta" onClick={outsideClickProData}   style={{display: styleProData}}>
    <div className="  w-[400px]
  bg-black
  p-[15px]
  pb-[50px]
  rounded-[5px]
  absolute
  right-0
  h-full
  text-[15px]
 overflow-y-scroll
   " >
        <div className="h-auto overflow-visible mb-[20px] mt-[20px] 

        
        
        ">
            <h2 id="proNameInDeta" className="text-3xl font-bold text-[#00FFFF] border-b border-[text-[#00FFFF]] pb-[5px] ">{project? project.name:""} </h2>
            <div className="[&>*]:mb-[10px] [&_*]:text-[18px] [&>*]:p-[7px]">
            <p className=" h-[100px] overflow-auto p-2 w-full  custom-scrollbar bg-[#2a2a2a] mt-[15px] rounded-[7px]"> <strong>Description:</strong> <span id="proDescription"> {project?project.description:"" } </span></p>
            <p className='bg-[#2a2a2a] rounded-[7px]'><strong>Category:</strong> <span id="proCategory"> {project? project.category:""} </span></p>
            <p className='bg-[#2a2a2a] rounded-[7px]'><strong>Students:</strong><span id="proStudents">{projectStudents}</span> </p>
            <p className='bg-[#2a2a2a] rounded-[7px]'><strong>Start Date:</strong> <span id="proStartDate">{project? project.startDate:""} </span></p>
            <p className='bg-[#2a2a2a] rounded-[7px]'><strong>End Date:</strong> <span id="proEndDate">{project? project.endDate:""} </span></p>
            </div>

        </div>
      
        <div className="mb-[20px] overflow-visible pb-[10px] " id="tasks">
            <h2 className='text-2xl mb-[20px] font-bold'>Tasks</h2>
            <div className='[&>*]:mb-[15px] '>
           {tasksDiv}
            </div>

      
          
        </div>
      </div>

    </div>


</>    
);
}
export default ProjectDataTemp;
