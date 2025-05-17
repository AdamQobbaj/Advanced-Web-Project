import React ,{useRef, useMemo  } from "react";
import { useContext, useState } from "react";
import { AddProjectContext } from '../contexts/addProjectContext';
import { ProjectsContext } from '../contexts/projectsContext';



const AddProjectTemp = () => {


    const {addedProject, SetaddedProject} = useContext(AddProjectContext);
    const {addProjectFlag, SetaddProjectFlag} = useContext(AddProjectContext);
    const {projects, setProjects} = useContext(ProjectsContext); 
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const modalRef = useRef();

 
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        startDate:"",
        endDate:"",
        status:"In Progress",
        students: [], // for multi-select
      });
    const onChangeProjectData= (event)=>{
        const { name, value, type, multiple, selectedOptions } = event.target;
         if (type === "select-multiple") {
            let selectedStudents=Array.from(selectedOptions).map(s=>parseInt(s.value));
            setFormData((prev) => ({ ...prev, [name]: selectedStudents }));  
          }
          else setFormData((prev) => ({ ...prev, [name]: value }));  
          console.log(formData);

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
        const { name, description, category, startDate, endDate, status, students } = formData;
      
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

    const addThePro = (e) => {
        // TODO: add the project
        if(isFormComplete()){
            const { name, description, category, startDate, endDate, status, students } = formData;
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
      <div className="modalout" id="promod" style={{display: addProjectFlag? "block":"none"}} onClick={outsideClickpro} ref={modalRef}>
        <div className="modal">
          <div className="modall-content">
            <span className="close-btn" onClick={closeAddPro}>&times;</span>
            <h2>Add New Project</h2>
            <form>

            
            <label>Project Title:</label>
            <input type="text" id="project-title" placeholder="Enter project title"  name="name"  onChange={onChangeProjectData}/>

            <label>Project Description:</label>
            <textarea id="project-description" placeholder="Enter project description" name="description" onChange={onChangeProjectData}></textarea>

            <label>Students List:</label>
            <select id="students-list" multiple name="students"   value={formData.students}  onChange={onChangeProjectData}>
                {studentOptions}
            </select>

            <label>Project Category:</label>
            <select id="project-category" name="category" onChange={onChangeProjectData}>
              <option>Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
            </select>

            <label>Starting Date:</label>
            <input type="date" id="start-date" name="startDate"  onChange={onChangeProjectData} />

            <label>Ending Date:</label>
            <input type="date" id="end-date" name="endDate" onChange={onChangeProjectData} />

            <label>Project Status:</label>
            <select id="project-status" name="status" onChange={onChangeProjectData}>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <button type="submit" className="add-project-btn" onClick={addThePro}>Add Project</button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProjectTemp;
