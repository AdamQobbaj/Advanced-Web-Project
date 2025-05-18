import React, { useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import DashboardChart from '../Components/DashboardChart';
import StatBox from '../Components/StatBox';

const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      status
    }
  }
`;

const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
    }
  }
`;

const GET_ALL_TASKS = gql`
  query GetAllTasks {
    getAllTasks {
      _id
    }
  }
`;

function AdminHome() {
  const timeRef = useRef(null);

  // Update time every second using ref
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleString();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // GraphQL data fetching
  const { data: projectData, loading: projectsLoading, error: projectsError } = useQuery(GET_ALL_PROJECTS);
  const { data: studentData, loading: studentsLoading, error: studentsError } = useQuery(GET_ALL_STUDENTS);
  const { data: taskData, loading: tasksLoading, error: tasksError } = useQuery(GET_ALL_TASKS);

  if (projectsLoading || studentsLoading || tasksLoading) {
    return <p>Loading data, please wait...</p>;
  }

  if (projectsError || studentsError || tasksError) {
    return <p>Error fetching data: {projectsError?.message || studentsError?.message || tasksError?.message}</p>;
  }

  const projects = projectData?.getAllProjects || [];
  const students = studentData?.getAllStudents || [];
  const tasks = taskData?.getAllTasks || [];

  const numProjects = projects.length;
  const numStudents = students.length;
  const numTasks = tasks.length;
  const numFinishedProjects = projects.filter(project => project.status === 'Completed').length;

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
        <StatBox title="Number of Students" value={numStudents} />
        <StatBox title="Number of Tasks" value={numTasks} />
        <StatBox title="Finished Projects" value={numFinishedProjects} />
      </div>

      <div className="align-center justify-center mt-5 md:p-20 md:pt-0 p-2 flex-wrap md:h-110">
        <h5 className="text-gray-600 font-bold text-md md:text-xl justify-center">
          Admin Dashboard Overview
        </h5>
        <DashboardChart
          labels={['Projects', 'Students', 'Tasks', 'Finished Projects']}
          dataValues={[numProjects, numStudents, numTasks, numFinishedProjects]}
        />
      </div>
    </>
  );
}

export default AdminHome;
