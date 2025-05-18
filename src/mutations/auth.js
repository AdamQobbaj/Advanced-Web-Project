import { gql } from '@apollo/client';

export const LOGIN_ADMIN = gql`
  mutation($name: String!, $password: String!){
    loginAdmin(name: $name, password: $password) {
      token
      id
    }
  }
`;

export const LOGIN_STUDENT = gql`
  mutation LoginStudent($name: String!, $password: String!) {
    loginStudent(name: $name, password: $password) {
      token
      id
    }
  }
`;