import { gql, QueryHookOptions, useQuery } from "@apollo/client";

const GET_KINDS = gql`
  query GetKinds {
    getKinds
  }
`;

function useKinds(options?: QueryHookOptions<{ getKinds: string[] }>) {
  return useQuery<{ getKinds: string[] }>(GET_KINDS, options);
}

export default useKinds;
