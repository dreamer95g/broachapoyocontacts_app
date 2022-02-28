import { gql } from "@apollo/client";

export const TRACKINGS = gql`
  query getTrackings {
    trackings {
      id
      date
      tracking_type
      observation
      pending_task
      ministerial_activity
      contact {
        id
        name
      }
    }
  }
`;

export const TRACKING_BY_ID = gql`
  query getTrackingById($id: ID!) {
    tracking(id: $id) {
      date
      tracking_type
      observation
      pending_task
      ministerial_activity
      contact {
        id
        name
      }
    }
  }
`;
