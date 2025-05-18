import { gql } from '@apollo/client';

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

export const GET_STUDENT_BY_NAME = gql`
  query GetStudentByName($name: String!) {
    getStudentByName(name: $name) {
      _id
      name
      major
    }
  }
`;
