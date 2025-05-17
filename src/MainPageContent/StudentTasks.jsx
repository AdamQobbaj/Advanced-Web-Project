import React, { useState, useEffect } from "react";
import TaskTable from "../Components/Tasks/TaskTable";
// Potentially import TaskModal if students can add/edit tasks
// import TaskModal from '../../Components/Tasks/TaskModal';

function StudentTasks() {
  // --- State Management ---
  const [allTasks, setAllTasks] = useState(
    () => JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [allProjects, setAllProjects] = useState(
    () => JSON.parse(localStorage.getItem("projects")) || []
  );
  const [allStudents, setAllStudents] = useState(
    () => JSON.parse(localStorage.getItem("students")) || []
  );
  const [activeUser, setActiveUser] = useState(
    () => JSON.parse(localStorage.getItem("active-user")) || null
  );
  // const [isModalOpen, setIsModalOpen] = useState(false); // Uncomment if students can add/edit
  const [sortBy, setSortBy] = useState("id"); // Default sort by ID

  // --- LocalStorage Synchronization (Only if students can modify data) ---
  /* Uncomment if needed
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }, [allTasks]);

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(allProjects));
    }, [allProjects]);
    */

  // --- Event Handlers ---
  // Uncomment and adapt if students have modal functionality
  /*
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddTask = (newTaskData) => {
        // Similar logic to AdminTasks, but potentially restricted
        // e.g., assignedTo might default to activeUser.id
        // project selection might be limited to student's projects
        console.log("Add Task (Student): ", newTaskData);
        handleCloseModal();
    };
    */

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // --- Filtering and Sorting Logic ---
  const getFilteredAndSortedTasks = () => {
    if (!activeUser) return [];

    // 1. Filter tasks for the active student
    const studentTasks = allTasks.filter(
      (task) =>
        Array.isArray(task.students) && task.students.includes(activeUser.id)
    );

    // 2. Sort the filtered tasks
    let sorted = [...studentTasks]; // Create a copy

    sorted.sort((a, b) => {
      switch (sortBy) {
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "project":
          const projectA = allProjects.find(
            (p) => p.id === parseInt(a.projectid)
          );
          const projectB = allProjects.find(
            (p) => p.id === parseInt(b.projectid)
          );
          return (projectA?.name || "").localeCompare(projectB?.name || "");
        case "dueDate":
          const dateA = new Date(a.dueDate || 0);
          const dateB = new Date(b.dueDate || 0);
          return dateA - dateB;
        // "assignedStudent" sort might be less relevant here as all tasks belong to the student
        // but keeping it for consistency if needed
        case "assignedStudent":
          const studentNameA =
            allStudents.find(
              (s) => Array.isArray(a.students) && a.students.includes(s.id)
            )?.name || "";
          const studentNameB =
            allStudents.find(
              (s) => Array.isArray(b.students) && b.students.includes(s.id)
            )?.name || "";
          return studentNameA.localeCompare(studentNameB);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "id":
        default:
          return (a.id || 0) - (b.id || 0);
      }
    });
    return sorted;
  };

  // --- Render ---
  const displayedTasks = getFilteredAndSortedTasks();

  // Handle case where user data isn't loaded yet
  if (!activeUser) {
    return <div className="p-6 text-white">Loading user data...</div>; // Or redirect to login
  }

  return (
    // Using Tailwind classes for styling
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header: Sort Dropdown (Add Task Button might be removed for students) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="sort-container flex items-center">
          <label
            htmlFor="sortBy"
            className="mr-2 text-sm font-medium text-gray-300"
          >
            Sort Your Tasks By:
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
            {/* <option value="assignedStudent">Assigned Student</option> */}
          </select>
        </div>
        {/* Optional: Add Task button for students if allowed */}
        {/*
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 w-full md:w-auto"
                >
                    Add New Task (if applicable)
                </button>
                */}
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={displayedTasks}
        projects={allProjects}
        students={allStudents}
      />

      {/* Task Modal (conditionally rendered if students can add/edit) */}
      {/*
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddTask}
                projects={allProjects.filter(p => p.students?.includes(activeUser.id))} // Maybe only show student's projects
                students={allStudents} // Modal might restrict selection to self
                // initialTaskData={null}
                // isEditMode={false}
            />
            */}
    </div>
  );
}

export default StudentTasks;
