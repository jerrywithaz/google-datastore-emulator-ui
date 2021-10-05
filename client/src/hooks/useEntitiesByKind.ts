import { useQuery, UseQueryOptions } from "react-query";
import api from "../api";

type UseEntitiesByKindOptions =
  | Omit<
      UseQueryOptions<
        Record<string, unknown>[],
        unknown,
        Record<string, unknown>[],
        string[]
      >,
      "queryKey" | "queryFn"
    >
  | undefined;

async function getEntitiesByKind(kind: string) {
  const result = await api.get<Record<string, unknown>[]>(
    `/datastore/entities/${kind}`
  );

  return result.data;
}

function useEntitiesByKind(kind: string, options?: UseEntitiesByKindOptions) {
  return useQuery(["entitiesByKind", kind], () => getEntitiesByKind(kind), {
    ...options,
    enabled: !!kind,
  });
}

export default useEntitiesByKind;
