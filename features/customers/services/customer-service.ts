import { customers } from "@/features/customers/data/customers"
import { parseCustomerQuery } from "@/features/customers/utils/customer-query"

import type {
  Customer,
  CustomersResponse,
} from "@/features/customers/types/types"
import { ApiResponse } from "@/types/types"
import {
  CreateCustomerInput,
  createCustomerSchema,
} from "../schemas/customer-schema"
import {
  updateCustomerSchema,
  type UpdateCustomerInput,
} from "@/features/customers/schemas/customer-schema"

export function getCustomers(request: Request): Response {
  const { searchParams } = new URL(request.url)

  const query = parseCustomerQuery(searchParams)

  let result = [...customers]

  if (query.search) {
    result = result.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query.search!) ||
        customer.email.toLowerCase().includes(query.search!) ||
        customer.company.toLowerCase().includes(query.search!)
      )
    })
  }

  if (query.filters.status.length > 0) {
    result = result.filter((customer) =>
      query.filters.status.includes(customer.status)
    )
  }

  if (query.filters.companies.length > 0) {
    const companies = query.filters.companies.map((company) =>
      company.toLowerCase()
    )

    result = result.filter((customer) =>
      companies.includes(customer.company.toLowerCase())
    )
  }

  if (query.filters.dateFrom) {
    result = result.filter(
      (customer) => customer.lastContactDate >= query.filters.dateFrom!
    )
  }

  if (query.filters.dateTo) {
    result = result.filter(
      (customer) => customer.lastContactDate <= query.filters.dateTo!
    )
  }

  if (query.filters.phone) {
    result = result.filter((customer) =>
      customer.phone.toLowerCase().includes(query.filters.phone!)
    )
  }

  if (query.filters.email) {
    result = result.filter((customer) =>
      customer.email.toLowerCase().includes(query.filters.email!)
    )
  }

  if (query.sortBy) {
    const direction = query.sortOrder === "desc" ? -1 : 1

    result.sort((a, b) => {
      const aValue = a[query.sortBy!]
      const bValue = b[query.sortBy!]

      return String(aValue).localeCompare(String(bValue)) * direction
    })
  }

  const total = result.length
  const totalPages = Math.ceil(total / query.pageSize)

  const safePage = Math.min(query.page, Math.max(totalPages, 1))

  const start = (safePage - 1) * query.pageSize
  const end = start + query.pageSize

  const response: CustomersResponse = {
    data: result.slice(start, end),
    meta: {
      page: safePage,
      pageSize: query.pageSize,
      total,
      totalPages,
    },
  }

  return Response.json(response)
}

export async function createCustomer(request: Request): Promise<Response> {
  const body: unknown = await request.json()

  const result = createCustomerSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid customer data",
          details: result.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const input: CreateCustomerInput = result.data

  const now = new Date().toISOString()

  const customer: Customer = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  customers.push(customer)

  const response: ApiResponse<Customer> = {
    data: customer,
  }

  return Response.json(response, { status: 201 })
}

export async function getCustomerById(id: string): Promise<Response> {
  const customer = customers.find((customer) => customer.id === id)

  if (!customer) {
    return Response.json(
      {
        error: {
          code: "CUSTOMER_NOT_FOUND",
          message: "Customer not found",
        },
      },
      { status: 404 }
    )
  }

  const response: ApiResponse<Customer> = {
    data: customer,
  }

  return Response.json(response)
}

export async function updateCustomer(
  id: string,
  request: Request
): Promise<Response> {
  const customerIndex = customers.findIndex((customer) => customer.id === id)

  if (customerIndex === -1) {
    return Response.json(
      {
        error: {
          code: "CUSTOMER_NOT_FOUND",
          message: "Customer not found",
        },
      },
      { status: 404 }
    )
  }

  const body: unknown = await request.json()

  const result = updateCustomerSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid customer data",
          details: result.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const input: UpdateCustomerInput = result.data

  const updatedCustomer: Customer = {
    ...customers[customerIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  }

  customers[customerIndex] = updatedCustomer

  const response: ApiResponse<Customer> = {
    data: updatedCustomer,
  }

  return Response.json(response)
}

export async function deleteCustomer(id: string): Promise<Response> {
  const customerIndex = customers.findIndex((customer) => customer.id === id)

  if (customerIndex === -1) {
    return Response.json(
      {
        error: {
          code: "CUSTOMER_NOT_FOUND",
          message: "Customer not found",
        },
      },
      { status: 404 }
    )
  }

  const [deletedCustomer] = customers.splice(customerIndex, 1)

  const response: ApiResponse<Customer> = {
    data: deletedCustomer,
  }

  return Response.json(response)
}
