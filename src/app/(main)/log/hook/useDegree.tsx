import { useMemo } from "react";
import { getDegree } from "@/api/log.api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Degree } from "../type";
import { ErrorType } from "@/types/type";

export default function useDegree() {
  const {
    data,
  }: UseQueryResult<Degree, ErrorType<object>> = useQuery({
    queryKey: ["degree"],
    queryFn: () =>
      getDegree()
        .then((res) => res?.data ?? {})
        .catch(() => {}),
    refetchInterval: 1000 * 60 * 5,
  });

  const degree = useMemo(() => data?.degree ?? null, [data]);
  const latestAssignedLogInfoIdx = useMemo(
    () => data?.latestAssignedLogInfoIdx ?? null,
    [data]
  );
  const mustAssignedLogInfoIdx = useMemo(
    () => data?.mustAssignedLogInfoIdx ?? null,
    [data]
  );

  return {
    degree,
    latestAssignedLogInfoIdx,
    mustAssignedLogInfoIdx,
  };
}
