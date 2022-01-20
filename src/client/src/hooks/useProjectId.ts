import { gql, useQuery } from "@apollo/client";

const GET_PROJECT_ID = gql`
  query GetProjectId {
    getProjectId
  }
`;

function useProjectId() {
  return useQuery<{ getProjectId: string }>(GET_PROJECT_ID);
}

export default useProjectId;
