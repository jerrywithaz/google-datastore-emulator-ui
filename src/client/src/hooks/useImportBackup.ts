import { gql, MutationHookOptions, useMutation } from "@apollo/client";

const IMPORT_BACKUP = gql`
  mutation ImportBackup($name: String!) {
    importBackup(name: $name)
  }
`;

function useImportBackup(options?: MutationHookOptions<{ importBackup: string }, { name: string }>) {
  return useMutation<{ importBackup: string }, { name: string }>(IMPORT_BACKUP, options);
}

export default useImportBackup;
