import { gql } from '@apollo/client';

export const GET_ALL_MESSAGES = gql`
  query GetAllMessages {
    getAllMessages {
      _id
      message
      time
    }
  }
`;

export const GET_MESSAGE = gql`
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      _id
      message
      time
    }
  }
`;

export const GET_ALL_MESSAGES_BY_ADMIN = gql`
  query GetAllMessagesByAdmin($adminid: ID!) {
    getAllMessagesByAdmin(adminid: $adminid) {
      _id
      message
      time
    }
  }
`;

export const GET_ALL_MESSAGES_BY_STUDENT = gql`
  query GetAllMessagesByStudent($studentid: ID!) {
    getAllMessagesByStudent(studentid: $studentid) {
      _id
      message
      time
    }
  }
`;