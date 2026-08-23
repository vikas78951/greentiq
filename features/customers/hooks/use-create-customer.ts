"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { Customer } from "@/features/customers/types/types"
import type { CreateCustomerInput } from "../schemas/customer-schema"
import type { ApiResponse } from "@/types/types"

async function createCustomer(
  input: CreateCustomerInput
): Promise<ApiResponse<Customer>> {
  const response = await fetch("/api/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.error?.message ?? "Failed to create customer")
  }

  return result
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })
}
