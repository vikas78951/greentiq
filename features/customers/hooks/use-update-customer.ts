"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { Customer } from "@/features/customers/types/types"
import type { ApiResponse } from "@/types/types"
import type { UpdateCustomerInput } from "../schemas/customer-schema"

type UpdateCustomerPayload = {
  id: string
  data: UpdateCustomerInput
}

async function updateCustomer({
  id,
  data,
}: UpdateCustomerPayload): Promise<ApiResponse<Customer>> {
  const response = await fetch(`/api/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.error?.message ?? "Failed to update customer")
  }

  return result
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCustomer,

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customers", variables.id],
        }),
      ])
    },
  })
}
