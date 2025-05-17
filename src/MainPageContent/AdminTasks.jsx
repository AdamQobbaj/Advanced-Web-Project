import React, {useContext , useState, useEffect } from "react";
import TaskTable from "../Components/Tasks/TaskTable";
import TaskModal from "../Components/Tasks/TaskModal";
  import { ProjectsContext } from '../contexts/projectsContext';

function AdminTasks() {
  // --- State Management ---
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("tasks")) || []
  );
 


  const [students, setStudents] = useState(
    () => JSON.parse(localStorage.getItem("students")) || []
  );

  const {projects, setProjects} = useContext(ProjectsContext); 



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("id"); // Default sort by ID

  // --- LocalStorage Synchronization ---
  useEffect(() => {
    // Save tasks whenever the tasks state changes
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Save projects whenever the projects state changes
    // Needed because adding a task modifies the project's tasks array
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // --- Event Handlers ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTask = (newTaskData) => {
    // Find the highest existing ID or start from 100
    const highestId = tasks.reduce(
      (max, task) => Math.max(max, task.id || 0),
      100
    );
    const newTaskId = highestId + 1;

    // Create the new task object
    const taskToAdd = {
      id: newTaskId,
      title: newTaskData.taskName,
      // Assuming 'name' field existed in original data, duplicating title for now
      name: newTaskData.taskName,
      description: newTaskData.description,
      students: [parseInt(newTaskData.assignedTo)], // Ensure student ID is an integer
      status: newTaskData.status,
      projectid: parseInt(newTaskData.selectedProject), // Ensure project ID is an integer
      dueDate: newTaskData.dueDate,
    };

    // Update tasks state
    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);

    // Update the corresponding project's tasks array
    const updatedProjects = projects.map((p) => {
      if (p.id === taskToAdd.projectid) {
        // Ensure the project has a tasks array before pushing
        const projectTasks = Array.isArray(p.tasks) ? p.tasks : [];
        return { ...p, tasks: [...projectTasks, newTaskId] };
      }
      return p;
    });
    setProjects(updatedProjects); // Update projects state

    handleCloseModal(); // Close the modal after adding
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
          const projectA = projects.find((p) => p.id === parseInt(a.projectid));
          const projectB = projects.find((p) => p.id === parseInt(b.projectid));
          return (projectA?.name || "").localeCompare(projectB?.name || "");
        case "dueDate":
          // Compare dates
          const dateA = new Date(a.dueDate || 0);
          const dateB = new Date(b.dueDate || 0);
          return dateA - dateB;
        case "assignedStudent":
          // Find student names for comparison (assuming one student per task as per current logic)
          const studentA = students.find(
            (s) => Array.isArray(a.students) && a.students.includes(s.id)
          );
          const studentB = students.find(
            (s) => Array.isArray(b.students) && b.students.includes(s.id)
          );
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
        projects={projects}
        students={students}
      />

      {/* Task Modal (conditionally rendered) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
        projects={projects}
        students={students}
        // initialTaskData={null} // Pass task data here for editing later
        // isEditMode={false}
      />
    </div>
  );
}

export default AdminTasks;
