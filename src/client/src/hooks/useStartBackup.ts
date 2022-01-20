import { gql, MutationHookOptions, useMutation } from "@apollo/client";

const START_BACKUP = gql`
  mutation StartBackup {
    startBackup
  }
`;

function useStartBackup(options?: MutationHookOptions<{ startBackup: string }>) {
  return useMutation<{ startBackup: string }>(START_BACKUP, options);
}

export default useStartBackup;
