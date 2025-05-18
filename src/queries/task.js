import { gql } from '@apollo/client';

export const GET_ALL_TASKS = gql`
  query GetAllTasks {
    getAllTasks {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    getTask(id: $id) {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
    }
  }
`;

export const GET_TASK_BY_NAME = gql`
  query GetTaskByName($name: String!) {
    getTaskByName(name: $name) {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
    }
  }
`;

export const GET_ALL_TASKS_BY_STUDENT = gql`
  query GetAllTasksByStudent($studentid: ID!) {
    getAllTasksByStudent(studentid: $studentid) {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
    }
  }
`;

export const GET_TASKS_BY_PROJECT_AND_STUDENT = gql`
  query GetTasksByProjectAndStudent($projectid: ID!, $studentid: ID!) {
    getTasksByProjectAndStudent(projectid: $projectid, studentid: $studentid) {
      _id
      title
      name
      description
      status
      dueDate
      studentid
      projectid
    }
  }
`;