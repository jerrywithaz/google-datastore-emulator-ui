import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { DatastoreBackup } from "../types/graphql";

const GET_BACKUPS = gql`
  query GetBackups {
    getBackups {
        id
        name
        date
        exists
        path
    }
  }
`;

function useBackups(options?: QueryHookOptions<{ getBackups: DatastoreBackup[] }>) {
  return useQuery<{ getBackups: DatastoreBackup[] }>(GET_BACKUPS, options);
}

export default useBackups;
