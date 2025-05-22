


import { useApolloClient, useMutation, useQuery, gql } from "@apollo/client";
import React, {  useState, useEffect } from "react";
  import {GET_ALL_TASKS} from '../../MainPageContent/AdminTasks'
import {GET_ALL_TASKS_BY_PROJECT} from"../ProjectDataTemp";


 const GET_TASK = gql`
  query GetTask($id: ID!) {
    getTask(id: $id) {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
      student{
        _id
        name
      }
      project{
      _id
      name
      }


    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

function TaskModalUpdateAdmin({
  taskID,
  onClose,
  onSubmit,
  projects = [],
  initialTaskData = null,
}) {
  const client = useApolloClient();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const isEditMode = !!initialTaskData;
  const activeUser = JSON.parse(localStorage.getItem("active-user"));
  const [taskToUpdate, setTaskToUpdate]=useState({})

const [deleteTask, { loading:loading3, error:error3 }] = useMutation(DELETE_TASK,);

 
  const { loading, error, data , refetch}=useQuery(GET_TASK ,{
   variables:{id:taskID.toString() },
   skip: !taskID || parseInt(taskID) < 0,
  });
  if(error){
     console.log(taskID);
    console.error(error);
  }


  useEffect(() => {
    if(data && data.getTask){
      const task=data.getTask;
      const DueDate=new Date(Number(task.dueDate));
      console.log(DueDate);
      const tastTemp={
        id:task._id,
        title:task.title,
        description:task.description,
        status:task.status,
        dueDate:DueDate.toISOString().split('T')[0],
        student:{
          id:task.student._id,
          name:task.student.name,
        },
        project:{
          id:task.project._id,
          name:task.project.name,
        },

       }

       setTaskToUpdate(tastTemp);
       setSelectedProjectId(tastTemp.project.id);
       setTaskName(tastTemp.title);
       setDueDate(tastTemp.dueDate);
       setAssignedTo(tastTemp.student.id.toString()),
       setStatus(tastTemp.status);
       setDescription(tastTemp.description);
     }
  }, [data]);




  useEffect(() => {
    if (parseInt(taskID)>0) {
      if (isEditMode) {
        setSelectedProjectId(initialTaskData.projectid?.toString() || "");
        setTaskName(initialTaskData.title || "");
        setDescription(initialTaskData.description || "");
        setStatus(initialTaskData.status || "");
        setDueDate(initialTaskData.dueDate || "");
        // Assigned student will be set by the second useEffect based on the project
      } else {
        setSelectedProjectId("");
        setTaskName("");
        setDescription("");
        setAssignedTo("");
        setStatus("");
        setDueDate("");
        setAvailableStudents([]);
      }
    }
  }, [taskID, isEditMode, initialTaskData]);







  useEffect(() => {
 
    if (parseInt(taskID) >0 && selectedProjectId) {

      const project = projects.find(
        (p) => p.id === selectedProjectId
      );
   


       const studentsForProject =  project?.students ||[];
       setAvailableStudents(studentsForProject);

      // Handle setting assignedTo based on mode and data
      if (
        isEditMode &&
        initialTaskData?.projectid?.toString() === selectedProjectId
      ) {
        // If editing and project hasn't changed, set the initial student
        setAssignedTo(initialTaskData.students?.[0]?.toString() || "");
      } else if (
        !isEditMode ||
        (isEditMode &&
          initialTaskData?.projectid?.toString() !== selectedProjectId)
      ) {
        // If adding new, or if project changed during edit, reset student selection
       }
    } else if (parseInt(taskID)>0 && !selectedProjectId) {
      setAvailableStudents([]);
     }
  }, [
    selectedProjectId,
    projects,
     taskID,
    isEditMode,
    initialTaskData,
  ]);





  if (parseInt(taskID)<0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProjectId || !taskName || !assignedTo || !status || !dueDate) {
      alert(
        "Please fill in all required fields: Project, Task Name, Student, Status, Due Date."
      );
      return;
    }
    onSubmit({
      taskID,
      selectedProject: selectedProjectId,
      taskName,
      description,
      assignedTo,
      status,
      dueDate,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };






const deleteTheTask= async (taskid)=>{

  if(activeUser.type==="admin"){
    if(!window.confirm("are you sure you want to delete this project task")) return;
    else{
      try {
        const { data:data3 } = await deleteTask({
          variables: { id: taskid },

          refetchQueries: [
       { query: GET_ALL_TASKS },
       { query: GET_ALL_TASKS_BY_PROJECT, variables: { projectid:  selectedProjectId } },
            ],
        },
  
      );
        setTaskToUpdate(-1);
        await client.reFetchObservableQueries();

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

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[1000] bg-opacity-70 flex items-center justify-center   p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-xl text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-blue-400">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="project"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Project Title:
            </label>
            <select
              id="project"
              value={selectedProjectId}
              onChange={(e) => {setSelectedProjectId(e.target.value)
                 console.log(selectedProjectId);}
                                          
              }
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm"
              required
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="taskName"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Task Name:
            </label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="assignedTo"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Assigned Student:
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={!selectedProjectId || availableStudents.length === 0}
            >
              <option value=""  disabled>
                {!selectedProjectId
                  ? "Select a project first"
                  : availableStudents.length === 0
                  ? "No students in project"
                  : "Select a student"}
              </option>
               {
              availableStudents.map((student) => (
                <option key={student.id} value={student.id.toString()}     >
 
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm"
              required
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Due Date:
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm [color-scheme:dark]"
              required
            />
          </div>


          <div className="w-[70%] mx-auto flex justify-between">

          <button
            type="submit"
            className="w-[45%] bg-green-600 hover:bg-green-700 p-2.5 rounded-[7px] font-semibold mt-2 transition duration-200"
          >
              Update Task
          </button>


            <button
             className="w-[45%] bg-red-500 hover:bg-[#905252] p-2.5 rounded-[7px] font-semibold mt-2 transition duration-200"
         onClick={() => deleteTheTask(taskID)}         >  Delete Task </button>

          </div>
 
        </form>
      </div>
    </div>
  );
}

export default TaskModalUpdateAdmin;






