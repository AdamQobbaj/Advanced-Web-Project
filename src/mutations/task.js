import { gql } from '@apollo/client';
import e from 'express';

export const ADD_TASK = gql`
  mutation AddTask(
    $title: String!,
    $name: String!,
    $description: String!,
    $status: String!,
    $dueDate: String!,
    $studentid: ID!,
    $projectid: ID!
  ) {
    addTask(
      title: $title,
      name: $name,
      description: $description,
      status: $status,
      dueDate: $dueDate,
      studentid: $studentid,
      projectid: $projectid
    ) {
      _id
      title
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!,
    $title: String,
    $name: String,
    $description: String,
    $status: String,
    $dueDate: String,
    $studentid: ID,
    $projectid: ID
  ) {
    updateTask(
      id: $id,
      title: $title,
      name: $name,
      description: $description,
      status: $status,
      dueDate: $dueDate,
      studentid: $studentid,
      projectid: $projectid
    ) {
      _id
      title
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;