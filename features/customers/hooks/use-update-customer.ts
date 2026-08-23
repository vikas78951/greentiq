"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { Customer } from "@/features/customers/types/types"
import type { ApiResponse } from "@/types/types"
import { UpdateCustomerInput } from "../schemas/customer-schema"

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

  if (!response.ok) {
    throw new Error("Failed to update customer")
  }

  return response.json()
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCustomer,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })

      queryClient.invalidateQueries({
        queryKey: ["customers", variables.id],
      })
    },
  })
}
