import { gql } from "@apollo/client";

export const CONTACTS = gql`
  query getContacts {
    contacts {
      id
      name
      dni
      phone
      email
      place
      categories {
        name
      }
    }
  }
`;

export const CONTACT_BY_ID = gql`
  query getContactById($id: ID!) {
    contact(id: $id) {
      id
      name
      dni
      phone
      email
      family
      place
      ministerial_area
      description
      commitment
      profession
      vocational_category
      ministerial_passion
      interest_group
      additional_note
      images {
        id
        name
      }
      categories {
        id
        name
      }
    }
  }
`;
export const CONTACT_BY_CATEGORY = gql`
  query contactByCategory($categories: Mixed) {
    contactByCategory(
      categories: { column: ID, operator: IN, value: $categories }
    ) {
      id
      name
      categories {
        id
        name
      }
    }
  }
`;
