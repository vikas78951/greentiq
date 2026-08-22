"use client"

import { useCustomers } from "@/features/customers/hooks/use-customers"

export default function CustomerTest() {
  const query = useCustomers({
    page: 1,
    pageSize: 10,
    filters: {
      status: [],
      companies: [],
    },
  })

  if (query.isPending) {
    return <div>Loading...</div>
  }

  if (query.isError) {
    return <div>{query.error.message}</div>
  }

  return (
    <pre>
      {JSON.stringify(query.data, null, 2)}
    </pre>
  )
}