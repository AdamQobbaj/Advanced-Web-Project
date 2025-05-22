import React ,{useRef, useMemo  } from "react";
import { useEffect,useContext, useState } from "react";
import { AddProjectContext } from '../contexts/addProjectContext';
import { ProjectsContext } from '../contexts/projectsContext';
import {useMutation, useQuery, gql } from "@apollo/client";

 const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
      name
     }
  }
`;
const ADD_PROJECT = gql`
  mutation AddProject(
    $name: String!,
    $description: String!,
    $category: String!,
    $status: String!,
    $startDate: String!,
    $endDate: String!,
    $studentsid: [ID!]!
  ) {
    addProject(
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



const AddProjectTemp = () => {


    const {addedProject, SetaddedProject} = useContext(AddProjectContext);
    const {addProjectFlag, SetaddProjectFlag} = useContext(AddProjectContext);
    const {projects, setProjects} = useContext(ProjectsContext); 
    //const students = JSON.parse(localStorage.getItem("students")) || [];
    const modalRef = useRef();
    const [ students, setStudents ] = useState([]);
        const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        startDate:"",
        endDate:"",
        status:"In Progress",
        studentsid: [], // for multi-select
      });
    const [addProject] = useMutation(ADD_PROJECT,{
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
            setFormData((prev) => ({ ...prev, [name]: selectedStudents }));  
          }
          else setFormData((prev) => ({ ...prev, [name]: value }));  
 
        };


      
        
    const closeAddPro = () => {
        // TODO: close the modal
        SetaddProjectFlag(false);

    };

    const outsideClickpro = (e) => {
        // TODO: handle clicks outside modal
        if (e.target === modalRef.current) {
            SetaddProjectFlag(false);

        }


    };
    const isFormComplete = () => {
        const { name, description, category, startDate, endDate, status, studentsid } = formData;
      
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

   /* const addThePro = (e) => {
        // TODO: add the project
        if(isFormComplete()){
            const { name, description, category, startDate, endDate, status, studentsid } = formData;
            let newProjectToStore = {
                id: projects.length+1,  // Make sure this ID is unique
                name:  name,
                description: description,
                category: category,
                status:status,
                startDate: startDate,
                endDate: endDate,
                students:  students,
                tasks:[],
                percentage:status=="Pending"?0: (status=="In Progress"?50:100),

             };
             const updatedProjects = [...projects, newProjectToStore];
             setProjects(updatedProjects);
             localStorage.setItem("projects", JSON.stringify(updatedProjects));
             SetaddProjectFlag(false);
             let g=[5,5,5];
             console.log(g);

        }
        

     };*/


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        //console.log(formData);
        const result = await addProject({ 
          variables: {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            status: formData.status,
            startDate: formData.startDate,
            endDate: formData.endDate,
            studentsid: formData.studentsid
          }


 
    });
 
      SetaddProjectFlag(false); // close modal    
        console.log('Project added:', result.data.addProject);
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
      <div className="block fixed top-0 left-0 w-full h-full bg-black/70 z-[1000]" id="promod" style={{display: addProjectFlag? "block":"none"}} onClick={outsideClickpro} ref={modalRef}>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] text-white p-[20px] w-[550px] h-[90%] rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.5)] block">
          <div className="flex flex-col ">
            <span className="absolute top-[10px] right-[15px] text-[20px] cursor-pointer text-white" onClick={closeAddPro}>&times;</span>
            <h2 className="text-2xl text-[#1e90ff] font-bold ">Add New Project</h2>
 
             <form onSubmit={handleSubmit} >

              
              <label className="font-bold mt-[5px]">Project Title:</label>
              <input className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              type="text" id="project-title" placeholder="Enter project title"  name="name"  onChange={onChangeProjectData}/>

              <label className="font-bold mt-[5px]" >Project Description:</label>
              <textarea className="bg-[#222]   border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="project-description" placeholder="Enter project description" name="description" onChange={onChangeProjectData}></textarea>

              <label className="font-bold mt-[5px]">Students List:</label>
              <select  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="students-list" multiple name="studentsid"   value={formData.students}  onChange={onChangeProjectData}>
                  {studentOptions}
              </select>

              <label className="font-bold mt-[5px]">Project Category:</label>
              <select  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="project-category" name="category" onChange={onChangeProjectData}>
                <option>Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
              </select>

              <label className="font-bold mt-[5px]">Starting Date:</label>
              <input   className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              type="date" id="start-date" name="startDate"  onChange={onChangeProjectData} />

              <label className="font-bold mt-[5px]">Ending Date:</label>
              <input  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              type="date" id="end-date" name="endDate" onChange={onChangeProjectData} />

              <label className="font-bold mt-[5px]">Project Status:</label>
              <select  className="bg-[#222] border border-[#444] text-white p-[8px] mt-[2px] rounded-[4px] w-full"
              id="project-status" name="status" onChange={onChangeProjectData}>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>

              <button type="submit"  disabled={loading} className="bg-[#4CAF50]  mr-auto text-white p-[7px] rounded-[4px] mt-[15px] cursor-pointer hover:bg-[#3d8b40]">Add Project</button>
            
            
          </form>
          
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProjectTemp;
