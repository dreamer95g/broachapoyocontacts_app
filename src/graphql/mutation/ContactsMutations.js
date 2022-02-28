import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
  mutation (
    $name: String!
    $dni: String
    $phone: String
    $email: String
    $family: String
    $place: String
    $ministerial_area: String
    $description: String
    $commitment: String
    $profession: String
    $vocational_category: String
    $ministerial_passion: String
    $interest_group: String
    $additional_note: String
    $categories: [ID]
    $images: [ID]
  ) {
    createContact(
      input: {
        name: $name
        dni: $dni
        phone: $phone
        email: $email
        family: $family
        place: $place
        ministerial_area: $ministerial_area
        description: $description
        commitment: $commitment
        profession: $profession
        vocational_category: $vocational_category
        ministerial_passion: $ministerial_passion
        interest_group: $interest_group
        additional_note: $additional_note
        images: { connect: $images }
        categories: { connect: $categories }
      }
    ) {
      id
      name
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation deleteContact($id: ID!) {
    deleteContact(id: $id) {
      name
    }
  }
`;

export const DELETE_CONTACTS = gql`
  mutation deleteContacts($ids: [Int]) {
    deleteContacts(ids: $ids) {
      id
    }
  }
`;

export const DISCONNECT_FOREIGN_KEYS = gql`
  mutation disconnectForeignKeys($id: ID!, $categories: [ID], $images: [ID]) {
    updateContact(
      input: {
        id: $id
        categories: { disconnect: $categories }
        images: { disconnect: $images }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation updateContact(
    $id: ID!
    $name: String
    $dni: String
    $phone: String
    $email: String
    $family: String
    $place: String
    $ministerial_area: String
    $description: String
    $commitment: String
    $profession: String
    $vocational_category: String
    $ministerial_passion: String
    $interest_group: String
    $additional_note: String
    $images: [ID]
    $categories: [ID]
  ) {
    updateContact(
      input: {
        id: $id
        name: $name
        dni: $dni
        phone: $phone
        email: $email
        family: $family
        place: $place
        ministerial_area: $ministerial_area
        description: $description
        commitment: $commitment
        profession: $profession
        vocational_category: $vocational_category
        ministerial_passion: $ministerial_passion
        interest_group: $interest_group
        additional_note: $additional_note
        images: { connect: $images }
        categories: { connect: $categories }
      }
    ) {
      id
    }
  }
`;
