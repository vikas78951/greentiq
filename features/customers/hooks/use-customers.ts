"use client"

import { useQuery } from "@tanstack/react-query"

import type {
  Customer,
  CustomerQuery,
} from "@/features/customers/types/types"
import type { ApiResponse } from "@/types/types"


type CustomersResponse = ApiResponse<Customer[]> 


const buildQueryString = (query: CustomerQuery) => {
  const params = new URLSearchParams()

  if (query.search) {
    params.set("search", query.search)
  }

  query.filters.status.forEach((status) => {
    params.append("status", status)
  })

  query.filters.companies.forEach((company) => {
    params.append("company", company)
  })

  if (query.filters.dateFrom) {
    params.set("dateFrom", query.filters.dateFrom)
  }

  if (query.filters.dateTo) {
    params.set("dateTo", query.filters.dateTo)
  }

  if (query.filters.phone) {
    params.set("phone", query.filters.phone)
  }

  if (query.filters.email) {
    params.set("email", query.filters.email)
  }

  if (query.sortBy) {
    params.set("sortBy", query.sortBy)
  }

  if (query.sortOrder) {
    params.set("sortOrder", query.sortOrder)
  }

  params.set("page", String(query.page))
  params.set("pageSize", String(query.pageSize))

  return params.toString()
}

async function fetchCustomers(
  query: CustomerQuery
): Promise<CustomersResponse> {
  const response = await fetch(
    `/api/customers?${buildQueryString(query)}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch customers")
  }

  return response.json()
}


export function useCustomers(query: CustomerQuery) {
  return useQuery({
    queryKey: ["customers", query],
    queryFn: () => fetchCustomers(query),
  })
}