import { gql } from "@apollo/client";

export const ORGANIZATIONS = gql`
  query getOrganizations {
    organizations {
      id
      name
      place
      categories {
        id
        name
      }
      contacts {
        id
        name
      }
    }
  }
`;

export const ORGANIZATION_BY_ID = gql`
  query organizationByID($id: ID!) {
    organization(id: $id) {
      id
      name
      purpose
      additional_note
      phone
      email
      place
      resources
      relationship
      categories {
        id
        name
      }
      contacts {
        id
        name
      }
    }
  }
`;
