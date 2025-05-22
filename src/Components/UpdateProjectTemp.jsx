import React ,{useRef, useMemo  } from "react";
import { useEffect,useContext, useState } from "react";
import { UpdateProjectContext } from '../contexts/updateProjectContext ';
import { ProjectsContext } from '../contexts/projectsContext';
import {useMutation, useQuery, gql } from "@apollo/client";
import {GET_ALL_TASKS_BY_PROJECT} from"../Components/ProjectDataTemp";
  import {GET_ALL_TASKS} from '../MainPageContent/AdminTasks'
 import {GET_ALL_PROJECTS} from '../MainPageContent/AdminProjects'

 const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
      name
     }
  }
`;
 
 const UPDATE_PROJECT = gql`
mutation UpdateProject(
  $id: ID!,
  $name: String,
  $description: String,
  $category: String,
  $status: String,
  $startDate: String,
  $endDate: String,
  $studentsid: [ID]
) {
  updateProject(
    id: $id,
    name: $name,
    description: $description,
    category: $category,
    status: $status,
    startDate: $startDate,
    endDate: $endDate,
    studentsid: $studentsid  
  ) {
    _id
    name
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
      studentsid
      category
      students{
      name
      _id
      }
    }
  }
`;


const UpdateProjectTemp = () => {
    
        const [projectToUpdate, setProjectToUpdate]=useState({
          id:" ",
          name:" ",
          description:" ",
          status:" ",
          startDate:null,
          endDate: null,
          students:[],
          category:" ",
          studentsid:[],
    }) ; 
     const {updateProjectID, setUpdateProjectID} = useContext(UpdateProjectContext);
    const { data: data2, loading: loading2, error: error2 } = useQuery(GET_PROJECT, {
      variables: { id: updateProjectID }
    });
     if(error2)console.log(error2);
      

      useEffect(() => {
        if (data2 && data2.getProject) {
          const pro = data2.getProject;
          const StartDate = new Date(Number(pro.startDate));
          const EndDate = new Date(Number(pro.endDate));
            const projectToUpdateTemp = {
            id: pro._id,
            name: pro.name,
            description: pro.description,
            status: pro.status,
            startDate: StartDate.toISOString().split('T')[0] ,
            endDate: EndDate.toISOString().split('T')[0],
            students: pro.students,
            category: pro.category,
            studentsid:pro.studentsid,
          };
          setProjectToUpdate(projectToUpdateTemp);
          console.log(projectToUpdateTemp);
        }
      }, [data2]);
     //const students = JSON.parse(localStorage.getItem("students")) || [];
    const modalRef = useRef();
    const [ students, setStudents ] = useState([]);
 
    const [updateProject] = useMutation(UPDATE_PROJECT,{
          refetchQueries: ['GetAllProjects'],
    });
    const { loading, data, error, refetch } = useQuery(GET_ALL_STUDENTS);
    if (error) {
    console.error("GraphQL Error:", error);
   }


    useEffect(() => {
      if (data && data.getAllStudents) {
        const studentsTemp = data.getAllStudents.map((s) => {

          return {
            id: s._id,
            name: s.name,

          };
        });
         setStudents(studentsTemp);
      }
    }, [data]);
  
    

 

    const onChangeProjectData= (event)=>{
        const { name, value, type, multiple, selectedOptions } = event.target;
         if (type === "select-multiple") {
            let selectedStudents=Array.from(selectedOptions).map(s=>s.value);
            setProjectToUpdate((prev) => ({ ...prev, [name]: selectedStudents }));  
          }
          else setProjectToUpdate((prev) => ({ ...prev, [name]: value }));  
 
        };


      
        
    const closeAddPro = () => {
        // TODO: close the modal
        setUpdateProjectID(-1);

    };

    const outsideClickpro = (e) => {
        // TODO: handle clicks outside modal
        if (e.target === modalRef.current) {
        setUpdateProjectID(-1);

        }


    };
    const isFormComplete = () => {
        const { name, description, category, startDate, endDate, status, studentsid } = projectToUpdate;
      
        return (
          name.trim() !== "" &&
          description.trim() !== "" &&
          category.trim() !== "" &&
          startDate.trim() !== "" &&
          endDate.trim() !== "" &&
          status.trim() !== "" &&
          students.length > 0
        );
      };

 

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const result = await updateProject({ 
          variables: {
            id:updateProjectID,
            name: projectToUpdate.name,
            description: projectToUpdate.description,
            category: projectToUpdate.category,
            status: projectToUpdate.status,
            startDate: projectToUpdate.startDate,
            endDate: projectToUpdate.endDate,
            studentsid: projectToUpdate.studentsid
          },
            refetchQueries: [
              { query: GET_ALL_PROJECTS },
              { query: GET_ALL_TASKS },
              { query: GET_ALL_TASKS_BY_PROJECT, variables: { projectid:updateProjectID  } },
            ],
 
    });
        console.log( projectToUpdate.studentsid);

         console.log('Project added:', result.data.id);
      } catch (err) {
        console.error('GraphQL Error:', err);
      }
    };
 

      const StudentOption=({studentID})=>{
        const student=students.find(s=>s.id==studentID);
        return(
            <>
            <option value={student.id}>{student.name}</option>
            </>
        );

    }
    const studentOptions = useMemo(() => {

        
        return students.map((s) => (
          <StudentOption studentID={s.id} key={s.id} />
        ));
      }, [students]);


  
      
      
 
  return (
    <>
      <div className="block fixed top-0 left-0 w-full h-full bg-black/70 z-[1000]" id="promod"  onClick={outsideClickpro} ref={modalRef}>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] text-white p-[20px] w-[550px] h-[90%] rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.5)] block">
          <div className="flex flex-col ">
            <span className="absolute top-[10px] right-[15px] text-[20px] cursor-pointer text-white" onClick={closeAddPro}>&times;</span>
            <h2 className="text-2xl text-[#1e90ff] font-bold ">Update Project</h2>
 
             <form  onSubmit={handleSubmit}>

              
              <label className="font-bold mt-[5px]">Project Title:</label>
              <input className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              type="text" id="project-title" placeholder="Enter project title"  name="name" value={projectToUpdate.name} onChange={onChangeProjectData}/>

              <label className="font-bold mt-[5px]" >Project Description:</label>
              <textarea className="bg-[#222]   border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="project-description" placeholder="Enter project description"  value={projectToUpdate.description} name="description" onChange={onChangeProjectData}></textarea>

              <label className="font-bold mt-[5px]">Students List:</label>
              <select  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="students-list" multiple name="studentsid"   value={projectToUpdate.studentsid}  onChange={onChangeProjectData}>
                  {studentOptions}
              </select>

              <label className="font-bold mt-[5px]">Project Category:</label>
              <select  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="project-category" name="category" value={projectToUpdate.category} onChange={onChangeProjectData}>
                <option>Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
              </select>

              <label className="font-bold mt-[5px]">Starting Date:</label>
              <input   className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              type="date" id="start-date" value={projectToUpdate.startDate} name="startDate"  onChange={onChangeProjectData} />

              <label className="font-bold mt-[5px]">Ending Date:</label>
              <input  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              type="date" id="end-date" name="endDate" value={projectToUpdate.endDate} onChange={onChangeProjectData} />

              <label className="font-bold mt-[5px]">Project Status:</label>
              <select  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="project-status" name="status" value={projectToUpdate.status} onChange={onChangeProjectData}>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>

              <button type="submit"  disabled={loading} className="bg-[#4CAF50]  mr-auto text-white p-[7px] rounded-[4px] mt-[15px] cursor-pointer hover:bg-[#3d8b40]">Update</button>
            
            
          </form>
          
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProjectTemp;
