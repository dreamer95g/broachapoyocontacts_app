import { gql } from "@apollo/client";

export const UPDATE_CATEGORY = gql`
  mutation updateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      name
    }
  }
`;

export const DELETE_CATEGORIES = gql`
  mutation deleteCategories($ids: [Int]) {
    deleteCategories(ids: $ids) {
      id
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      id
    }
  }
`;
