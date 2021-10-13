import { GridSortModel } from "@mui/x-data-grid";
import { useState } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { v4 as uuid } from 'uuid';
import api from "../api";

type RunQueryInfo = {
  endCursor?: string;
  moreResults?: 'MORE_RESULTS_TYPE_UNSPECIFIED' | 'NOT_FINISHED' | 'MORE_RESULTS_AFTER_LIMIT' | 'MORE_RESULTS_AFTER_CURSOR' | 'NO_MORE_RESULTS';
}

type Result = {
  info: RunQueryInfo;
  entities: Record<string, unknown>[];
};

type UseEntitiesByKindOptions =
  | Omit<
      UseQueryOptions<unknown, unknown, Result, string[]>,
      "queryKey" | "queryFn"
    >
  | undefined;

async function getEntitiesByKind(kind: string, page: number, pageSize: number, filters: [any, any, any][], sortModel: GridSortModel | null) {
  const result = await api.get<Result>(`/datastore/entities/${kind}`, {
    params: { page, pageSize, filters, sortModel }
  });

  const { info, entities } = result.data;

  return {
    info,
    entities: entities.map((entity) => {
      return {
        ...entity,
        id: entity.id ?? entity?.__key__ ?? `set by client: ${uuid()}`,
      }
    })
  };
}

function useEntitiesByKind(kind: string, filters: [any, any, any][], sortModel: GridSortModel | null, options?: UseEntitiesByKindOptions) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(pageSize);

  const result = useQuery(["entitiesByKind", kind, page.toString(), pageSize.toString()], () => getEntitiesByKind(kind, page, pageSize, filters, sortModel), {
    ...options,
    enabled: !!kind,
    onSuccess: (data) => {
      const { moreResults } = data.info;

      if (moreResults === 'MORE_RESULTS_AFTER_LIMIT' || moreResults === 'MORE_RESULTS_AFTER_CURSOR') {
        setRowCount((page + 2) * pageSize);
      }
    },
  });

  return { result, changePage: setPage, page, setPageSize, pageSize, rowCount };
}

export default useEntitiesByKind;
