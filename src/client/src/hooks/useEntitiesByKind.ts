import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { EntitiesResult, GetEntitiesInput } from "../types/graphql";

const GET_ENTITIES_BY_KIND = gql`
  query GetEntities($input: GetEntitiesInput!) {
    getEntities(input: $input) {
      entities {
        entity
        key
      }
      info {
        moreResults
        endCursor
      }
    }
  }
`;

function useEntitiesByKind(
  input: GetEntitiesInput,
) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(pageSize);

  const result = useLazyQuery<{ getEntities: EntitiesResult }, { input: GetEntitiesInput }>(GET_ENTITIES_BY_KIND, {
    variables: { input: { ...input, page, pageSize } },
    onCompleted: (data) => {
      const { moreResults } = data.getEntities.info;

      if (
        moreResults === "MORE_RESULTS_AFTER_LIMIT" ||
        moreResults === "MORE_RESULTS_AFTER_CURSOR"
      ) {
        setRowCount((page + 2) * pageSize);
      }
    },
  });

  return { result, changePage: setPage, page, setPageSize, pageSize, rowCount };
}

export default useEntitiesByKind;
