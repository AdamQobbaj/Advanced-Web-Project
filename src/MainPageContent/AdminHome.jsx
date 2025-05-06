
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
        <div className="welcome-div">
            <h2 className="welcome-header">Welcome to the Task Management System</h2>
            <h3>{currentDate}</h3>
        </div>

        <div className="stats">
        <StatBox title="Number of Projects" value={numProjects} />
        <StatBox title="Number of Students" value={numStudents} />
        <StatBox title="Number of Tasks" value={numTasks} />
        <StatBox title="Number of Finished Projects" value={numFinishedProjects} />
        </div>

        <div className="dashboard-container">
        <h5 className="dashboard-title">Admin Dashboard Overview</h5>
        <DashboardChart
            labels={['Projects', 'Students', 'Tasks', 'Finished Projects']}
            dataValues={[numProjects, numStudents, numTasks, numFinishedProjects]}
        />
        </div>
    </>
    
  );
}

export default AdminHome;