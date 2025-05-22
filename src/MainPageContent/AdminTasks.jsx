import React, {useContext , useState, useEffect } from "react";
import TaskTable from "../Components/Tasks/TaskTable";
import TaskModal from "../Components/Tasks/TaskModal";
import { ProjectsContext } from '../contexts/projectsContext';
import { TasksContext } from '../contexts/tasksContext';
import { useApolloClient ,useMutation, useQuery, gql } from "@apollo/client";
import {GET_ALL_TASKS_BY_PROJECT} from"../Components/ProjectDataTemp";
import TaskModalUpdateAdmin from "../Components/Tasks/TaskModalUpdateAdmin";


  export const GET_ALL_TASKS = gql`
  query GetAllTasks {
    getAllTasks {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      student{
      _id
      name
      }
      projectid
      project{
      _id
      name
      }
    }
  }
`;

 const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      _id
      name
      description
      status
      studentsid
      startDate
      endDate
      category
      students {
        name
        _id
      }
    }
  }
`;

 const ADD_TASK = gql`
  mutation AddTask(
    $title: String!,
    $name: String!,
    $description: String!,
    $status: String!,
    $dueDate: String!,
    $studentid: ID!,
    $projectid: ID!
  ) {
    addTask(
      title: $title,
      name: $name,
      description: $description,
      status: $status,
      dueDate: $dueDate,
      studentid: $studentid,
      projectid: $projectid
    ) {
      _id
      title
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!,
    $title: String,
    $name: String,
    $description: String,
    $status: String,
    $dueDate: String,
    $studentid: ID,
    $projectid: ID
  ) {
    updateTask(
      id: $id,
      title: $title,
      name: $name,
      description: $description,
      status: $status,
      dueDate: $dueDate,
      studentid: $studentid,
      projectid: $projectid
    ) {
      _id
       
    }
  }
`;



function AdminTasks() {
  // --- State Management ---
   const client = useApolloClient();
 


  

  const {projects, setProjects} = useContext(ProjectsContext); 
  const {tasks, setTasks} = useContext(TasksContext); 


    const { loading, error, data , refetch} = useQuery(GET_ALL_TASKS);
    //if(error)console.log(error);
    useEffect(() => {
      if (data && data.getAllTasks) {
        const tasksTemp = data.getAllTasks.map((task) => {
          const dueDate = new Date(Number(task.dueDate));
 
          return {
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            student: task.student,
            dueDate: dueDate.toLocaleDateString(),
            project:task.project,
           };
        });
        setTasks(tasksTemp);
       }
    }, [data]);

    const { loading: lodafing2, data:data2, error:error2, refetch:refetch2 } = useQuery(GET_ALL_PROJECTS);
    //if(error2)console.log(error2);
    useEffect(() => {
      if (data2 && data2.getAllProjects) {
        const projectsTemp = data2.getAllProjects.map((pro) => {
          const StartDate = new Date(Number(pro.startDate));
          const EndDate = new Date(Number(pro.endDate));

          return {
            id: pro._id,
            name: pro.name,
            description: pro.description,
            status: pro.status,
            students: pro.students.map((s) => {
           return {              
              name:s.name,
              id: s._id,
            }
              
            
            }),
            category: pro.category,
            startDate: StartDate.toLocaleDateString(),
            endDate: EndDate.toLocaleDateString(),
          };
        });
        setProjects(projectsTemp);
       }
    }, [data2]);

 


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("id"); // Default sort by ID
  const [taskID, setTaskID] = useState(-1);

  
  


 

  // --- Event Handlers ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


    const handleOpenModalUpdate = (id) => {
    setTaskID(id);
  };

  const handleCloseModalUpdate = () => {
    setTaskID(-1);
  };
   
   const [newTaskProjectID,setNewTaskProjectID]=useState(-1);
  const [addTask, { loading: adding, error: addError }] = useMutation(ADD_TASK);

  const [updateTask, { loading: updating, error: updaterror }] = useMutation(UPDATE_TASK);


  const handleAddTask = async (newTaskData) => {
    //console.log(newTaskData);
    setNewTaskProjectID(newTaskData.selectedProject);

  try {
    const { data:data3 } = await addTask({
      variables: {
        title: newTaskData.taskName,
        name: newTaskData.taskName,              // you used it twice before
        description: newTaskData.description,
        status: newTaskData.status,
        dueDate:new Date(newTaskData.dueDate).toISOString(),            // keep as ISO string
        studentid: newTaskData.assignedTo,       // already an ID
        projectid: newTaskData.selectedProject,  // already an ID
      },

      refetchQueries: [
    { query: GET_ALL_TASKS },
    { query: GET_ALL_TASKS_BY_PROJECT, variables: { projectid: newTaskData.selectedProject } },
  ],
    });
 
    handleCloseModal();
    await client.reFetchObservableQueries();
  } catch (err) {
    //console.error('Failed to add task:', err);
    alert('Could not add task, please try again.');
  }
};


  const handleUpdateTask = async (newTaskData) => {
    //console.log(newTaskData);
    setNewTaskProjectID(newTaskData.selectedProject);

  try {
     const { data:data4 } = await updateTask({
      variables: {
        id:newTaskData.taskID,
        title: newTaskData.taskName,
        name: newTaskData.taskName,              // you used it twice before
        description: newTaskData.description,
        status: newTaskData.status,
        dueDate:new Date(newTaskData.dueDate).toISOString(),            // keep as ISO string
        studentid: newTaskData.assignedTo,       // already an ID
        projectid: newTaskData.selectedProject,  // already an ID
      },

      refetchQueries: [
    { query: GET_ALL_TASKS },
    { query: GET_ALL_TASKS_BY_PROJECT, variables: { projectid: newTaskData.selectedProject } },
  ],
    });
 
    handleCloseModalUpdate();
    await client.reFetchObservableQueries();
  } catch (err) {
    //console.error('Failed to add task:', err);
    //alert('Could not add task, please try again.');
  }
};


  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // --- Sorting Logic ---
  const getSortedTasks = () => {
    let sorted = [...tasks]; // Create a copy to avoid mutating original state
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "project":
          // Find project names for comparison
          const projectA =  a.project;
          const projectB =b.project;
          return (projectA?.name || "").localeCompare(projectB?.name || "");
        case "dueDate":
          // Compare dates
          const dateA = new Date(a.dueDate || 0);
          const dateB = new Date(b.dueDate || 0);
          return dateA - dateB;
        case "assignedStudent":
          // Find student names for comparison (assuming one student per task as per current logic)
          const studentA = a.student;
       
          const studentB =  b.student;
          return (studentA?.name || "").localeCompare(studentB?.name || "");
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "id":
        default:
          // Compare IDs
          return (a.id || 0) - (b.id || 0);
      }
    });
    return sorted;
  };

  // --- Render ---
  const displayedTasks = getSortedTasks();
 
  return (
    // Using Tailwind classes for styling - adapt as needed
    <div className="p-4 md:p-6   min-h-screen text-white">
      {/* Header: Sort Dropdown and Add Task Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="sort-container flex items-center">
          <label
            htmlFor="sortBy"
            className="mr-2 text-sm font-medium text-gray-300"
          >
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 focus:outline-none appearance-none"
          >
            <option value="id">Task ID</option>
            <option value="title">Task Name</option>
            <option value="status">Status</option>
            <option value="project">Project</option>
            <option value="dueDate">Due Date</option>
            <option value="assignedStudent">Assigned Student</option>
          </select>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 w-full md:w-auto"
        >
          Create New Task
        </button>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={displayedTasks}
        onClick={handleOpenModalUpdate}
  
      />

      {/* Task Modal (conditionally rendered) */}
       <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
        projects={projects}
         // initialTaskData={null} // Pass task data here for editing later
        // isEditMode={false}
      />

        <TaskModalUpdateAdmin
        taskID={taskID}
        onClose={handleCloseModalUpdate}
        onSubmit={handleUpdateTask}
        projects={projects}
         // initialTaskData={null} // Pass task data here for editing later
        // isEditMode={false}
      />





    </div>
  );
}

export default AdminTasks;
