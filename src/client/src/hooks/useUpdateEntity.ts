import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { UpdateEntityInput } from "../types/graphql";

const UPDATE_ENTITY = gql`
  mutation UpdateEntity($input: UpdateEntityInput!) {
    updateEntity(input: $input) {
        entity
        key
        path
    }
  }
`;

function useUpdateEntity(options?: MutationHookOptions<{ getKinds: string[] }, { input: UpdateEntityInput }>) {
  return useMutation<{ getKinds: string[] }, { input: UpdateEntityInput }>(UPDATE_ENTITY, options);
}

export default useUpdateEntity;
