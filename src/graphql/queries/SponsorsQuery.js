import { gql } from "@apollo/client";

export const SPONSORS = gql`
  query getSponsors {
    sponsors {
      id
      name
      contacts {
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

export const SPONSOR_BY_ID = gql`
  query sponsorByID($id: ID!) {
    sponsor(id: $id) {
      id
      name
      commitment
      communication
      contacts {
        id
        name
      }
      categories {
        id
        name
      }
      offerings {
        id
        year
        month
        amount
      }
    }
  }
`;
