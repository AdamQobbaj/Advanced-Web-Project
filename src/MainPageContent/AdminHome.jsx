
import DashboardChart from '../Components/DashboardChart'; // adjust path if needed
import StatBox from '../Components/StatBox';



function AdminHome() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    const numProjects = projects.length;
    const numStudents = students.length;
    const numTasks = tasks.length;
    const numFinishedProjects = projects.filter(project => project.status === "Completed").length;
  
    const currentDate = new Date().toLocaleString();
  return (
    <>
        <div className="grid justify-center text-center md:h-1 mt-5 md:flex md:justify-between">
            <h2 className="text-center text-[#007bff] text-xl font-bold md:text-2xl">Welcome to the Task Management System</h2>
            <h3 className='text-white text-md md:text-xl'>{currentDate}</h3>
        </div>

        <div className="flex gap-1 md:gap-7 justify-center md:justify-between md:p-15 md:pb-0 p-2 flex-wrap">
        <StatBox title="Number of Projects" value={numProjects} />
        <StatBox title="Number of Students" value={numStudents} />
        <StatBox title="Number of Tasks" value={numTasks} />
        <StatBox title="Number of Finished Projects" value={numFinishedProjects} />
        </div>

        <div className="align-center justify-center mt-5 md:p-20 md:pt-0 p-2 flex-wrap md:h-110">
          <h5 className="text-gray-600 font-bold text-md md:text-xl jutsify-center">Admin Dashboard Overview</h5>
          <DashboardChart
              labels={['Projects', 'Students', 'Tasks', 'Finished Projects']}
              dataValues={[numProjects, numStudents, numTasks, numFinishedProjects]}
          />
        </div>
    </>
    
  );
}

export default AdminHome;