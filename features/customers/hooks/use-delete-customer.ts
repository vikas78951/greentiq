"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`/api/customers/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const result = await response.json()

    throw new Error(result?.error?.message ?? "Failed to delete customer")
  }
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.removeQueries({
          queryKey: ["customers", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        }),
      ])
    },
  })
}
