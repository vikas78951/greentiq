"use client"

import * as React from "react"

import { useCustomers } from "@/features/customers/hooks/use-customers"
import { companies } from "@/features/customers/data/customers"
import { columns } from "@/features/customers/components/columns"
import { DataTable } from "@/features/customers/components/customer-table"
import { CustomerFilters } from "@/features/customers/components/customer-filters"

import type {
  CustomerStatus,
  FilterState,
} from "@/features/customers/types/types"

export default function CustomerTest() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    companies: [],
  })

  const query = useCustomers({
    search: search || undefined,

    page: pagination.pageIndex + 1,

    pageSize:
      pagination.pageSize as 10 | 25 | 50,

    filters,
  })

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value)

    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }

  const handleStatusChange = (
    status: CustomerStatus | undefined
  ) => {
    setFilters((previous) => ({
      ...previous,
      status: status ? [status] : [],
    }))

    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }

  const handleCompanyChange = (
    company: string | undefined
  ) => {
    setFilters((previous) => ({
      ...previous,
      companies: company ? [company] : [],
    }))

    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }

  if (query.isPending) {
    return <div>Loading...</div>
  }

  if (query.isError) {
    return <div>{query.error.message}</div>
  }

  if (!query.isSuccess) {
    return null
  }

  return (
    <section className="space-y-4 p-4">
      <CustomerFilters
        search={search}
        filters={filters}
        companies={companies}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCompanyChange={handleCompanyChange}
        onAddCustomer={() => {
          console.log("Add customer")
        }}
      />

      <DataTable
        columns={columns}
        data={query.data.data}
        pagination={query.data.meta}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
    </section>
  )
}