





import React, { useState, useEffect } from "react";

function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  initialTaskData = null,
}) {
  const activeUser = JSON.parse(localStorage.getItem("active-user"));
   const [selectedProjectId, setSelectedProjectId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(activeUser.id);
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const isEditMode = !!initialTaskData;
 
  useEffect(() => {
    if (isOpen) {
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
        setAssignedTo(activeUser.id);
        setStatus("");
        setDueDate("");
        setAvailableStudents([]);
      }
    }
  }, [isOpen, isEditMode, initialTaskData]);







  useEffect(() => {
    if (isOpen && selectedProjectId) {

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
        setAssignedTo(activeUser.id);
      }
    } else if (isOpen && !selectedProjectId) {
      setAvailableStudents([]);
      setAssignedTo(activeUser.id);
    }
  }, [
    selectedProjectId,
    projects,
     isOpen,
    isEditMode,
    initialTaskData,
  ]);





  if (!isOpen) return null;

  const handleSubmit = (e) => {

    e.preventDefault();
    console.log({
       selectedProjectIdss:selectedProjectId,
       taskNamess:taskName,
       assignedToff:assignedTo,
       statusfff:status,
       dueDatesfrdf:dueDate,
    })
    if (!selectedProjectId || !taskName || !assignedTo || !status || !dueDate) {
      alert(
        "Please fill in all required fields: Project, Task Name, Student, Status, Due Date."
      );
      return;
    }
    onSubmit({
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
            ×
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
              value={activeUser.id}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
               
              disabled={!selectedProjectId || availableStudents.length === 0}
            >
              <option value={activeUser.id}   disabled>
               {activeUser.name}
              </option>
               {
              availableStudents.filter(s=>s.id!==activeUser.id).map((student) => (
                <option key={student.id} value={student.id.toString()} disabled  >
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
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2.5 rounded font-semibold mt-2 transition duration-200"
          >
            {isEditMode ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;








