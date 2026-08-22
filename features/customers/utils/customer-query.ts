import { customerStatusSchema ,customerQuerySchema } from "../schemas/customer-schema"

import { TABLE_CONFIG } from "@/lib/constants"

import type { CustomerQuery } from "@/features/customers/types/types"


const parseNumber = (
  value: string | null,
  fallback: number
): number => {
  if (!value) return fallback

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

const parseStatuses = (
  searchParams: URLSearchParams
) => {
  return searchParams
    .getAll("status")
    .flatMap((value) => value.split(","))
    .filter((value) =>
      customerStatusSchema.safeParse(value).success
    )
}

const parseCompanies = (
  searchParams: URLSearchParams
): string[] => {
  return searchParams
    .getAll("company")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
}

export function parseCustomerQuery(
  searchParams: URLSearchParams
): CustomerQuery {
  const rawPage = parseNumber(
    searchParams.get("page"),
    TABLE_CONFIG.DEFAULT_PAGE
  )

  const rawPageSize = parseNumber(
    searchParams.get("pageSize"),
    TABLE_CONFIG.DEFAULT_PAGE_SIZE
  )

  const pageSize = TABLE_CONFIG.ALLOWED_PAGE_SIZES.includes(
    rawPageSize as (typeof TABLE_CONFIG.ALLOWED_PAGE_SIZES)[number]
  )
    ? (rawPageSize as CustomerQuery["pageSize"])
    : TABLE_CONFIG.DEFAULT_PAGE_SIZE

  const query = {
    search:
      searchParams.get("search")?.trim().toLowerCase() ||
      undefined,

    filters: {
      status: parseStatuses(searchParams),
      companies: parseCompanies(searchParams),
      dateFrom:
        searchParams.get("dateFrom") || undefined,
      dateTo:
        searchParams.get("dateTo") || undefined,
      phone:
        searchParams.get("phone")?.trim().toLowerCase() ||
        undefined,
      email:
        searchParams.get("email")?.trim().toLowerCase() ||
        undefined,
    },

    sortBy:
      searchParams.get("sortBy") || undefined,

    sortOrder:
      searchParams.get("sortOrder") || undefined,

    page: rawPage,
    pageSize,
  }

  return customerQuerySchema.parse(query)
}