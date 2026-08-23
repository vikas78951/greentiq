"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

type ReorderCustomersInput = {
  activeId: string
  overId: string
}

async function reorderCustomers({ activeId, overId }: ReorderCustomersInput) {
  const response = await fetch("/api/customers/reorder", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      activeId,
      overId,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.error?.message ?? "Failed to reorder customers")
  }

  return result
}

export function useReorderCustomers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reorderCustomers,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })
}
