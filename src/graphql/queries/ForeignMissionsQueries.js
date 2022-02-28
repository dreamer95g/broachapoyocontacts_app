import { gql } from "@apollo/client";

export const FOREIGN_MISSIONS = gql`
  query getForeignMissions {
    foreignMissions {
      id
      name
      place
      representatives {
        id
        name
      }
      missionaries {
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

export const FOREIGN_MISSION_BY_ID = gql`
  query getForeignMissionById($id: ID!) {
    foreignMission(id: $id) {
      id
      name
      place
      additional_note
      purpose
      ministerial_focus
      capacitation_resources
      resources
      global_opportunities
      representatives {
        id
        name
      }
      missionaries {
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
