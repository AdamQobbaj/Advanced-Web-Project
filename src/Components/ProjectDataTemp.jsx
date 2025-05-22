import { ProjectDataContext } from '../contexts/projectDataContext';
import { useEffect,useContext, useState } from "react";
import { ProjectsContext } from '../contexts/projectsContext';
import {useMutation , useQuery, gql } from "@apollo/client";
 import { UpdateProjectContext } from '../contexts/updateProjectContext ';
 import {GET_ALL_PROJECTS} from '../MainPageContent/AdminProjects'
  import {GET_ALL_TASKS} from '../MainPageContent/AdminTasks'


  export const GET_ALL_TASKS_BY_PROJECT = gql`
  query GetAllTasksByProject($projectid: ID!) {
    getAllTasksByProject(projectid: $projectid) {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
      student{
      name
      }
 
    }
  }
`;
const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    getProject(id: $id) {
      _id
      name
      description
      status
      startDate
      endDate
      studentid
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;


    const ProjectDataTemp=()=>{
     const {projectData, setProjectData } = useContext(ProjectDataContext);
    
     const projectID=projectData;

      const {updateProjectID, setUpdateProjectID} = useContext(UpdateProjectContext);

      const activeUser = JSON.parse(localStorage.getItem("active-user"));

      const [deleteProject, { loading:loading3, error:error3 }] = useMutation(DELETE_PROJECT,);

  
      const {projects, Setprojects} = useContext(ProjectsContext); 
      const [tasks, setTasks] = useState([]);
  
        
      const { loading, error, data } = useQuery(GET_ALL_TASKS_BY_PROJECT, {
        variables: { projectid: projectID },
    });
  
      
      useEffect(() => {
        if (data && data.getAllTasksByProject) {
           const tasksTemp = data.getAllTasksByProject.map((task) => {
            const DueDate = new Date(Number(task.dueDate));
     
            return {
              id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              students: [task.student],
              dueDate: DueDate.toLocaleDateString(),
             };
          });
          setTasks(tasksTemp);
          //console.log(tasks);
        }
      }, [data]);
    



     
     const project=projects.find(p=>p.id==projectID);

    
    //console.log(project);
    //console.log(projectID);


    const TaskTemp=({taskID,num})=>{
        const task=tasks.find(t=>t.id==taskID);
  
    return(
        
        <>
                <div className="bg-[#222] p-[10px] border border-[#00ff66] mb-[10px] rounded-[5px] h-[23vh] flex flex-col justify-between" >
                <strong  >Task #: <span id="proTaskID">{num}</span> </strong>
                <p className="mb-auto"><strong>Task Name:</strong> <span id="proTaskName">{task.title}</span></p>
                <p className="mb-auto"><strong>Description:</strong> <span id="proTaskDescription">{task.description}</span></p>
                <p className="mb-auto"><strong>Assigned Student:</strong> <span id="proTaskStudent">{task.students[0].name} </span></p>
                <p className="mb-auto"><strong>Status:</strong> <span id="proTaskStatus">{task.status}</span></p>
            </div>
        
        </>
    );
    }


    let tasksDiv=project ? tasks.map(tt=>{
      return <TaskTemp  key={tt.id} taskID={tt.id} num={tasks.indexOf(tt)} />
    }) : <></>;
    
    
    let projectStudentsArray=project?.students||[];
    let projectStudents="";
    projectStudentsArray.forEach(element => {
      projectStudents+=element+" , ";
    });
    projectStudents=projectStudents.slice(0, -3);

 
 




     let styleProData= projectID<0 ?"hidden":"visible";

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
              project.classList.add("border-transparent");

    
            });
  
           }
  
  
  
        }  
}

const deleteTheProject= async (projectId)=>{

  if(activeUser.type==="admin"){
    if(!window.confirm("are you sure you want to delete this project")) return;
    else{
      try {
        const { data:data3 } = await deleteProject({
          variables: { id: projectId },

          refetchQueries: [
              { query: GET_ALL_PROJECTS },
              { query: GET_ALL_TASKS },
            ],
        },
      
      
      );
        setProjectData(-1);

      } catch (err) {
        console.error("Failed to delete project:", err.message);
        alert("Error deleting project");
      }      
      
    }

  
  }
  else{
    alert("you are not authorized to delete the project");
    return;
  }

}

 const updateTheProject=(e)=>{
  setUpdateProjectID(projectID)
   
 }



 
return(

<>
<div className="fixed top-0 left-0 w-full h-full z-[1000]   " id="ProDeta" onClick={outsideClickProData}  style={{visibility: styleProData}}>
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
            <h2 id="proNameInDeta" className="whitespace-normal break-words text-3xl font-bold text-[#00FFFF] border-b border-[text-[#00FFFF]] pb-[5px] ">{project? project.name:""} </h2>
            <div className="[&>*]:mb-[10px] [&_*]:text-[18px] [&>*]:p-[7px]">
            <p className=" h-[100px] overflow-auto p-2 w-full whitespace-normal break-words custom-scrollbar bg-[#2a2a2a] mt-[15px] rounded-[7px]"> <strong>Description:</strong> <span id="proDescription"> {project?project.description:"" } </span></p>
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

            <div className='w-[90%] m-auto flex justify-between'>
              {activeUser.type==="admin"?<button  disabled={loading} className="bg-[#b30909] text-[17px] border-[#C0C0C0] border-[1px]  w-[100px] font-bold mr-auto text-white p-[7px] rounded-[7px] mt-[15px] cursor-pointer hover:bg-[#653939]" onClick={() => deleteTheProject(projectID)} >Delete</button>:<></>}
              {activeUser.type==="admin"?<button  disabled={loading} className="bg-[#38af38] text-[17px] border-[#C0C0C0] border-[1px]  w-[100px] font-bold mr-auto text-white p-[7px] rounded-[7px] mt-[15px] cursor-pointer hover:bg-[#486f48]" onClick={ updateTheProject} >Update</button>:<></>}

            </div>

      
          
        </div>
      </div>

    </div>


</>    
);
}
export default ProjectDataTemp;
