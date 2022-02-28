import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION = gql`
  mutation createOrganization(
    $name: String
    $purpose: String
    $additional_note: String
    $phone: String
    $email: String
    $place: String
    $resources: String
    $relationship: String
    $categories: [ID]
    $contacts: [ID]
  ) {
    createOrganization(
      input: {
        name: $name
        purpose: $purpose
        additional_note: $additional_note
        phone: $phone
        email: $email
        place: $place
        resources: $resources
        relationship: $relationship
        categories: { connect: $categories }
        contacts: { connect: $contacts }
      }
    ) {
      id
      name
    }
  }
`;

export const DELETE_ORGANIZATION = gql`
  mutation deleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      name
    }
  }
`;

export const DELETE_ORGANIZATIONS = gql`
  mutation deleteOrganizations($ids: [Int]) {
    deleteOrganizations(ids: $ids) {
      id
    }
  }
`;

export const DISCONNECT_FOREIGN_KEYS = gql`
  mutation disconnectForeignKeys($id: ID!, $categories: [ID], $contacts: [ID]) {
    updateOrganization(
      input: {
        id: $id
        categories: { disconnect: $categories }
        contacts: { disconnect: $contacts }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation updateOrganization(
    $id: ID!
    $name: String
    $purpose: String
    $additional_note: String
    $phone: String
    $email: String
    $place: String
    $resources: String
    $relationship: String
    $categories: [ID]
    $contacts: [ID]
  ) {
    updateOrganization(
      input: {
        id: $id
        name: $name
        purpose: $purpose
        additional_note: $additional_note
        phone: $phone
        email: $email
        place: $place
        resources: $resources
        relationship: $relationship
        categories: { connect: $categories }
        contacts: { connect: $contacts }
      }
    ) {
      id
    }
  }
`;
