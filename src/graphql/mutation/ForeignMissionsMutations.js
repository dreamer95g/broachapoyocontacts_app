import { gql } from "@apollo/client";

export const CREATE_FOREIGN_MISSION = gql`
  mutation createForeignMission(
    $name: String!
    $place: String
    $additional_note: String
    $purpose: String
    $ministerial_focus: String
    $capacitation_resources: String
    $resources: String
    $global_opportunities: String
    $representatives: [ID]
    $missionaries: [ID]
    $categories: [ID]
  ) {
    createForeignMission(
      input: {
        name: $name
        place: $place
        additional_note: $additional_note
        purpose: $purpose
        ministerial_focus: $ministerial_focus
        capacitation_resources: $capacitation_resources
        resources: $resources
        global_opportunities: $global_opportunities
        representatives: { connect: $representatives }
        missionaries: { connect: $missionaries }
        categories: { connect: $categories }
      }
    ) {
      id
    }
  }
`;

export const DELETE_FOREIGN_MISSION = gql`
  mutation deleteForeignMission($id: ID!) {
    deleteForeignMission(id: $id) {
      name
    }
  }
`;

export const DELETE_MISSIONS = gql`
  mutation deleteMissions($ids: [Int]) {
    deleteMissions(ids: $ids) {
      id
    }
  }
`;

export const DISCONNECT_FOREIGN_KEYS = gql`
  mutation disconnectForeignKeys(
    $id: ID!
    $categories: [ID]
    $missionaries: [ID]
    $representatives: [ID]
  ) {
    updateForeignMission(
      input: {
        id: $id
        categories: { disconnect: $categories }
        missionaries: { disconnect: $missionaries }
        representatives: { disconnect: $representatives }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_FOREIGN_MISSION = gql`
  mutation updateForeignMission(
    $id: ID!
    $name: String!
    $place: String
    $additional_note: String
    $purpose: String
    $ministerial_focus: String
    $capacitation_resources: String
    $resources: String
    $global_opportunities: String
    $representatives: [ID]
    $missionaries: [ID]
    $categories: [ID]
  ) {
    updateForeignMission(
      input: {
        id: $id
        name: $name
        place: $place
        additional_note: $additional_note
        purpose: $purpose
        ministerial_focus: $ministerial_focus
        capacitation_resources: $capacitation_resources
        resources: $resources
        global_opportunities: $global_opportunities
        representatives: { connect: $representatives }
        missionaries: { connect: $missionaries }
        categories: { connect: $categories }
      }
    ) {
      id
    }
  }
`;
