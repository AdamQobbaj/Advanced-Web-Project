import React, { useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import DashboardChart from '../Components/DashboardChart';
import StatBox from '../Components/StatBox';

const GET_ALL_PROJECTS_BY_STUDENT = gql`
  query getAllProjectsByStudent($studentid: ID!) {
    getAllProjectsByStudent(studentid: $studentid) {
      status
    }
  }
`;

const GET_ALL_TASKS_BY_STUDENT = gql`
  query GetAllTasksByStudent($studentid: ID!) {
    getAllTasksByStudent(studentid: $studentid) {
      _id
    }
  }
`;

function StudentHome() {
  const timeRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleString();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeUser = JSON.parse(localStorage.getItem("active-user"));
  const studentId = activeUser?.id;

  if (!studentId) {
    return <p>Error: Student ID not found!</p>;
  }

  const { data: projectData, loading: loadingProjects, error: errorProjects } = useQuery(GET_ALL_PROJECTS_BY_STUDENT, {
    variables: { studentid: studentId }
  });
  const { data: taskData, loading: loadingTasks, error: errorTasks } = useQuery(GET_ALL_TASKS_BY_STUDENT, {
    variables: { studentid: studentId }
  });

  if (loadingProjects || loadingTasks) {
    return (
      <p>
        Loading data... Projects: {loadingProjects ? "loading..." : "loaded"} | Tasks: {loadingTasks ? "loading..." : "loaded"}
      </p>
    );
  }

  if (errorProjects) {
    return <p>Error fetching project data: {errorProjects.message}</p>;
  }

  if (errorTasks) {
    return <p>Error fetching task data: {errorTasks.message}</p>;
  }

  const allProjects = projectData?.getAllProjectsByStudent || [];
  const allTasks = taskData?.getAllTasksByStudent || [];

  const studentProjects = allProjects ;
  const studentTasks = allTasks ;

  const numProjects = studentProjects.length;
  const numTasks = studentTasks.length;
  const numFinishedProjects = studentProjects.filter(p => p.status === "Completed").length;

  return (
    <>
      <div className="grid justify-center text-center md:h-1 mt-5 md:flex md:justify-between">
        <h2 className="text-center text-[#007bff] text-xl font-bold md:text-2xl">
          Welcome to the Task Management System
        </h2>
        <h3 className='text-white text-md md:text-xl' ref={timeRef}>
          {new Date().toLocaleString()}
        </h3>
      </div>

      <div className="flex gap-1 md:gap-7 justify-center md:justify-between md:p-15 md:pb-0 p-2 flex-wrap">
        <StatBox title="Number of Projects" value={numProjects} />
        <StatBox title="Number of Tasks" value={numTasks} />
        <StatBox title="Finished Projects" value={numFinishedProjects} />
      </div>

      <div className="align-center justify-center mt-5 md:p-20 md:pt-0 p-2 flex-wrap md:h-110">
        <h5 className="text-gray-600 font-bold text-md md:text-xl justify-center">
          Student Dashboard Overview
        </h5>
        <DashboardChart
          labels={['Projects', 'Tasks', 'Finished Projects']}
          dataValues={[numProjects || 0, numTasks || 0, numFinishedProjects || 0]}
        />
      </div>
    </>
  );
}

export default StudentHome;
