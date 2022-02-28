import { gql } from "@apollo/client";

export const ME = gql`
  query me {
    me {
      id
      name
      email
      roles {
        id
        name
      }
      images {
        id
        name
      }
    }
  }
`;
