import { gql } from '@apollo/client';

export const GET_ADMIN = gql`
  query GetAdmin($id: ID!) {
    getAdmin(id: $id) {
      _id
      name
    }
  }
`;

export const GET_ALL_ADMINS = gql`
  query GetAllAdmins {
    getAllAdmins {
      _id
      name
    }
  }
`;

export const GET_ADMIN_BY_NAME = gql`
  query GetAdminByName($name: String!) {
    getAdminByName(name: $name) {
      _id
      name
    }
  }
`;