
import DashboardChart from '../Components/DashboardChart'; // adjust path if needed
import StatBox from '../Components/StatBox';



function StudentHome() {
    let activeUser = JSON.parse(localStorage.getItem("active-user"));
    let student = JSON.parse(localStorage.getItem("students")).find(student => student.id === activeUser.id);
    let studentProjects = JSON.parse(localStorage.getItem("projects")).filter(project => project.students.includes(student.id));
    let studentTasks = JSON.parse(localStorage.getItem("tasks")).filter(task => task.students.includes(student.id));
    let numProjects = studentProjects.length;
    let numTasks = studentTasks.length;
    let numFinishedProjects = studentProjects.filter(project => project.status === "Completed").length;
  
    const currentDate = new Date().toLocaleString();
  return (
    <>
        <div className="welcome-div">
            <h2 className="welcome-header">Welcome to the Task Management System</h2>
            <h3>{currentDate}</h3>
        </div>

        <div className="stats">
            <StatBox title="Number of Projects" value={numProjects} />
            <StatBox title="Number of Tasks" value={numTasks} />
            <StatBox title="Number of Finished Projects" value={numFinishedProjects} />
        </div>

        <div className="dashboard-container">
        <h5 className="dashboard-title">Admin Dashboard Overview</h5>
        <DashboardChart
            labels={['Projects', 'Tasks', 'Finished Projects']}
            dataValues={[numProjects, numTasks, numFinishedProjects]}
        />
        </div>
    </>
    
  );
}

export default StudentHome;