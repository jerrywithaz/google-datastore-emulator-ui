import { gql, MutationHookOptions, useMutation } from "@apollo/client";

const DOWNLOAD_BACKUP = gql`
  mutation DownloadBackup($name: String!) {
    downloadBackup(name: $name)
  }
`;

function useDownloadBackup(options?: MutationHookOptions<{ downloadBackup: string }, { name: string }>) {
  return useMutation<{ downloadBackup: string }, { name: string }>(DOWNLOAD_BACKUP, options);
}

export default useDownloadBackup;
