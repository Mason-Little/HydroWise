import type { QueryKey, UseMutationOptions } from "@tanstack/react-query";
import type { APIResponse } from "@/api/client";
import { queryClient } from "@/lib/query/query-client";

type OptimisticListContext<TItem> = {
  previous?: APIResponse<TItem[]>;
};

type OptimisticListParams<TItem, TVariables> = {
  queryKey: QueryKey;
  apply: (current: TItem[], variables: TVariables) => TItem[];
  invalidateKey?: QueryKey;
};

export const makeOptimisticListMutation = <TItem, TVariables>({
  queryKey,
  apply,
  invalidateKey = queryKey,
}: OptimisticListParams<TItem, TVariables>): Pick<
  UseMutationOptions<
    APIResponse<TItem>,
    Error,
    TVariables,
    OptimisticListContext<TItem>
  >,
  "onMutate" | "onError" | "onSettled"
> => {
  return {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<APIResponse<TItem[]>>(queryKey);
      const current = previous?.data ?? [];

      queryClient.setQueryData<APIResponse<TItem[]>>(queryKey, {
        data: apply(current, variables),
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  };
};
