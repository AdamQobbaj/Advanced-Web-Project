import { gql } from '@apollo/client';

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      _id
      name
      description
      status
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    getProject(id: $id) {
      _id
      name
      description
      status
      startDate
      endDate
      studentid
    }
  }
`;

export const GET_PROJECT_BY_NAME = gql`
  query GetProjectByName($name: String!) {
    getProjectByName(name: $name) {
      _id
      name
      description
      status
      startDate
      endDate
      studentid
    }
  }
`;

export const GET_ALL_PROJECTS_BY_STUDENT = gql`
  query GetAllProjectsByStudent($studentid: ID!) {
    getAllProjectsByStudent(studentid: $studentid) {
      _id
      name
      description
      status
      startDate
      endDate
    }
  }
`;