import { gql } from '@apollo/client';

export const ADD_MESSAGE = gql`
  mutation AddMessage($message: String!, $time: String!, $adminid: ID!, $studentid: ID!) {
    addMessage(message: $message, time: $time, adminid: $adminid, studentid: $studentid) {
      _id
      message
      time
    }
  }
`;

