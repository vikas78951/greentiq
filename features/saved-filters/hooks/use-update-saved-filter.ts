import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { FilterState } from "@/features/customers/types/types"

type UpdateSavedFilterInput = {
  id: string
  name?: string
  filters?: FilterState
}

export function useUpdateSavedFilter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, name, filters }: UpdateSavedFilterInput) => {
      const response = await fetch(`/api/saved-filters/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(name !== undefined && { name }),
          ...(filters !== undefined && { filters }),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error?.message ?? "Failed to update saved filter"
        )
      }

      return result
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["saved-filters"],
      })
    },
  })
}
