import { gql } from "@apollo/client";

export const CREATE_TRACKING = gql`
  mutation createTracking(
    $date: Date
    $tracking_type: String
    $observation: String
    $pending_task: String
    $ministerial_activity: String
    $contact: ID
  ) {
    createTracking(
      input: {
        tracking_type: $tracking_type
        date: $date
        observation: $observation
        pending_task: $pending_task
        ministerial_activity: $ministerial_activity
        contact: { connect: $contact }
      }
    ) {
      id
    }
  }
`;

export const DELETE_TRACKING = gql`
  mutation deleteTracking($id: ID!) {
    deleteTracking(id: $id) {
      id
    }
  }
`;

export const DELETE_TRACKINGS = gql`
  mutation deleteTrackings($ids: [Int]) {
    deleteTrackings(ids: $ids) {
      id
    }
  }
`;

export const DISCONNECT_FOREIGN_KEYS = gql`
  mutation disconnectForeignKeys($id: ID!, $contact: ID) {
    updateTracking(input: { id: $id, contact: { connect: $contact } }) {
      id
    }
  }
`;

export const UPDATE_TRACKING = gql`
  mutation updateTracking(
    $id: ID!
    $date: Date
    $tracking_type: String
    $observation: String
    $pending_task: String
    $ministerial_activity: String
    $contact: ID
  ) {
    updateTracking(
      input: {
        id: $id
        tracking_type: $tracking_type
        date: $date
        observation: $observation
        pending_task: $pending_task
        ministerial_activity: $ministerial_activity
        contact: { connect: $contact }
      }
    ) {
      id
    }
  }
`;
