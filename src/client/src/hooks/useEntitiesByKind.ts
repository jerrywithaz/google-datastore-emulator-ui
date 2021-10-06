import { useState } from "react";
import { useQuery, UseQueryOptions } from "react-query";
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

async function getEntitiesByKind(kind: string, pageCursor?: string) {
  const result = await api.get<Result>(`/datastore/entities/${kind}`, {
    params: pageCursor ? { pageCursor } : undefined
  });

  return result.data;
}

function useEntitiesByKind(kind: string, options?: UseEntitiesByKindOptions) {
  const [pageCursor, setPageCursor] = useState<string>('');
  const [page, setPage] = useState(0);

  const result = useQuery(["entitiesByKind", kind, page.toString()], () => getEntitiesByKind(kind, pageCursor), {
    ...options,
    enabled: !!kind,
    onSuccess: (data) => {
      if (data.info.endCursor) {
        setPageCursor(data.info.endCursor);
      }
    },
  });

  return { result, changePage: setPage, page };
}

export default useEntitiesByKind;
