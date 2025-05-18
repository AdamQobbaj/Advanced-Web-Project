import { gql } from '@apollo/client';

export const ADD_PROJECT = gql`
  mutation AddProject(
    $name: String!,
    $description: String!,
    $category: String!,
    $status: String!,
    $startDate: String!,
    $endDate: String!,
    $studentid: ID!
  ) {
    addProject(
      name: $name,
      description: $description,
      category: $category,
      status: $status,
      startDate: $startDate,
      endDate: $endDate,
      studentid: $studentid
    ) {
      _id
      name
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!,
    $name: String,
    $description: String,
    $category: String,
    $status: String,
    $startDate: String,
    $endDate: String,
    $studentid: ID
  ) {
    updateProject(
      id: $id,
      name: $name,
      description: $description,
      category: $category,
      status: $status,
      startDate: $startDate,
      endDate: $endDate,
      studentid: $studentid
    ) {
      _id
      name
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

