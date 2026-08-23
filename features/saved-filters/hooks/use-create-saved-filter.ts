"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { FilterState } from "@/features/customers/types/types"
import type { SavedFilter } from "@/features/saved-filters/types/types"
import type { ApiResponse } from "@/types/types"

interface CreateSavedFilterInput {
  name: string
  filters: FilterState
}

export function useCreateSavedFilter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      input: CreateSavedFilterInput
    ): Promise<ApiResponse<SavedFilter>> => {
      const response = await fetch("/api/saved-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error?.message ?? "Failed to save filter")
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
