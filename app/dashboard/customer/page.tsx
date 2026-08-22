"use client"

import * as React from "react"

import { useCustomers } from "@/features/customers/hooks/use-customers"
import { columns } from "@/features/customers/components/columns"
import { DataTable } from "@/features/customers/components/customer-table"

export default function CustomerTest() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const query = useCustomers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize as 10 | 25 | 50,
    filters: {
      status: [],
      companies: [],
    },
  })

  const defualtMeta = { page: 1, pageSize: 10, total: 0, totalPages: 0 }

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
    <section className="p-4">
      <DataTable
        columns={columns}
        data={query.data.data}
        pagination={query.data.meta || defualtMeta}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
    </section>
  )
}
