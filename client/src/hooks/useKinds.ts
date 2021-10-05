import { useQuery, UseQueryOptions } from "react-query";
import api from "../api";

type UseKindsOptions =
  | Omit<
      UseQueryOptions<string[], unknown, string[], "kinds">,
      "queryKey" | "queryFn"
    >
  | undefined;

async function getKinds() {
  const result = await api.get<string[]>("/datastore/kinds");

  return result.data;
}

function useKinds(options?: UseKindsOptions) {
  return useQuery("kinds", getKinds, options);
}

export default useKinds;
