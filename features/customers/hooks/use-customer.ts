"use client"

import { useQuery } from "@tanstack/react-query"

import type { Customer } from "@/features/customers/types/types"
import type { ApiResponse } from "@/types/types"

async function fetchCustomer(id: string): Promise<ApiResponse<Customer>> {
  const response = await fetch(`/api/customers/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch customer")
  }

  return response.json()
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => fetchCustomer(id),
    enabled: Boolean(id),
  })
}