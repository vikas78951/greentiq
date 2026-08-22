"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`/api/customers/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete customer")
  }
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: ["customers", id],
      })

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })
}