
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
        <div className="grid justify-center text-center md:h-1 mt-5 md:flex md:justify-between">
            <h2 className="text-center text-[#007bff] text-xl font-bold md:text-2xl">Welcome to the Task Management System</h2>
            <h3 className='text-white text-md md:text-xl'>{currentDate}</h3>
        </div>

        <div className="flex gap-1 md:gap-7 justify-center md:justify-between md:p-15 md:pb-0 p-2 flex-wrap">
            <StatBox title="Number of Projects" value={numProjects} />
            <StatBox title="Number of Tasks" value={numTasks} />
            <StatBox title="Number of Finished Projects" value={numFinishedProjects} />
        </div>

        <div className="align-center justify-center mt-5 md:p-20 md:pt-0 p-2 flex-wrap md:h-110">
            <h5 className="text-gray-600 font-bold text-md md:text-xl jutsify-center">Admin Dashboard Overview</h5>
            <DashboardChart
                labels={['Projects', 'Tasks', 'Finished Projects']}
                dataValues={[numProjects, numTasks, numFinishedProjects]}
            />
        </div>
    </>
    
  );
}

export default StudentHome;