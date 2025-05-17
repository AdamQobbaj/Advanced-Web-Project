import React from "react";
import TaskRow from "./TaskRow";

function TaskTable({ tasks, projects, students }) {
  if (!tasks || !projects || !students) {
    return <div className="text-center py-4">Loading data...</div>;
  }

  return (
    <div className="table-container mt-6 shadow-lg rounded-lg overflow-x-auto bg-gray-800">
      <table id="taskTable" className="min-w-full">
        <thead>
          <tr className="bg-gray-900 text-gray-300 uppercase text-xs leading-normal">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Project</th>
            <th className="py-3 px-4 text-left">Task Name</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Assigned Student</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-left">Due Date</th>
          </tr>
        </thead>
        <tbody id="taskTableBody" className="text-gray-200 text-sm font-light">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const project = projects.find(
                (p) => p.id === parseInt(task.projectid)
              );
              const projectName = project ? project.name : "Unlinked";

              const student = students.find(
                (s) =>
                  Array.isArray(task.students) && task.students.includes(s.id)
              );
              const studentName = student ? student.name : "Unknown/None";

              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  projectName={projectName}
                  studentName={studentName}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskTable;
