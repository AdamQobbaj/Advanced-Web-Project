import { gql } from '@apollo/client';

export const ADD_STUDENT = gql`
  mutation AddStudent($name: String!, $major: String!, $password: String!) {
    addStudent(name: $name, major: $major, password: $password) {
      _id
      name
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $name: String, $major: String, $password: String) {
    updateStudent(id: $id, name: $name, major: $major, password: $password) {
      _id
      name
      major
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;

export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
      name
      major
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      _id
      name
      major
    }
  }
`;