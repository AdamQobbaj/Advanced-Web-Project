import { handleError } from "@apollo/client/link/http/parseAndCheckHttpResponse";
import React from "react";

function getStatusColorClass(status) {
  switch (status) {
    case "Completed":
      return "bg-green-600 text-green-100";
    case "In Progress":
      return "bg-blue-600 text-blue-100";
    case "Pending":
      return "bg-yellow-600 text-yellow-100";
    case "On Hold":
      return "bg-gray-600 text-gray-100";
    case "Cancelled":
      return "bg-red-600 text-red-100";
    default:
      return "bg-gray-400 text-gray-800";
  }
}

function TaskRow({ task, projectName, studentName , num, onClick}) {
  const handleClick=(e)=>{
    e.preventDefault();
  onClick(task.id);
  }
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700" onClick={handleClick}>
      <td className="px-4 py-3 text-sm">{num }</td>
      <td className="px-4 py-3 text-sm">{projectName || "Unlinked"}</td>
      <td className="px-4 py-3 text-sm">{task.title || ""}</td>
      <td
        className="px-4 py-3 text-sm max-w-xs truncate"
        title={task.description || ""}
      >
        {task.description || ""}
      </td>
      <td className="px-4 py-3 text-sm">{studentName || "None"}</td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(
            task.status || ""
          )}`}
        >
          {task.status || "N/A"}
        </span>
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        {task.dueDate || "N/A"}
      </td>
    </tr>
  );
}

export default TaskRow;
