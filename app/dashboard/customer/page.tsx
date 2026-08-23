"use client"

import * as React from "react"
import { SlidersHorizontal, X } from "lucide-react"

import { useCustomers } from "@/features/customers/hooks/use-customers"
import { useDebounce } from "@/hooks/use-debounce"

import { AdvanceFilterDrawer } from "@/features/customers/components/advance-filter"
import { CustomerFilters } from "@/features/customers/components/customer-filters"
import { DataTable } from "@/features/customers/components/customer-table"

import { companies } from "@/features/customers/data/customers"
import { columns } from "@/features/customers/components/columns"

import type {
  CustomerStatus,
  FilterState,
} from "@/features/customers/types/types"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"

const emptyFilters: FilterState = {
  status: [],
  companies: [],
  dateFrom: undefined,
  dateTo: undefined,
  phone: undefined,
  email: undefined,
}

function cloneFilters(filters: FilterState): FilterState {
  return {
    status: [...filters.status],
    companies: [...filters.companies],
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    phone: filters.phone,
    email: filters.email,
  }
}

export default function CustomerPage() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [searchInput, setSearchInput] = React.useState("")
  const search = useDebounce(searchInput, 500)

  // Filters actually applied to the customer query.
  const [filters, setFilters] = React.useState<FilterState>(emptyFilters)

  // Filters currently being edited inside the drawer.
  const [draftFilters, setDraftFilters] =
    React.useState<FilterState>(emptyFilters)

  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false)

  const query = useCustomers({
    search: search || undefined,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize as 10 | 25 | 50,
    filters,
  })

  const resetPage = () => {
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    resetPage()
  }

  const handleStatusChange = (status: CustomerStatus | undefined) => {
    setFilters((previous) => ({
      ...previous,
      status: status ? [status] : [],
    }))

    resetPage()
  }

  const handleCompanyChange = (company: string | undefined) => {
    setFilters((previous) => ({
      ...previous,
      companies: company ? [company] : [],
    }))

    resetPage()
  }

  /*
   * Open drawer:
   * copy currently applied filters into draft state.
   */
  const handleFilterDrawerOpen = () => {
    setDraftFilters(cloneFilters(filters))
    setFilterDrawerOpen(true)
  }

  /*
   * User changes filters inside drawer.
   * Nothing is applied to the table yet.
   */
  const handleDraftFiltersChange: React.Dispatch<
    React.SetStateAction<FilterState>
  > = (value) => {
    setDraftFilters(value)
  }

  /*
   * Apply draft filters to the actual customer query.
   */
  const handleApplyFilters = (nextFilters: FilterState) => {
    const next = cloneFilters(nextFilters)

    setFilters(next)
    setDraftFilters(next)

    resetPage()
    setFilterDrawerOpen(false)
  }

  /*
   * Clear everything.
   */
  const handleClearFilters = () => {
    const empty = cloneFilters(emptyFilters)

    setFilters(empty)
    setDraftFilters(empty)

    resetPage()
  }

  /*
   * Applying a saved filter immediately applies it.
   */
  const handleApplySavedFilter = (nextFilters: FilterState) => {
    const next = cloneFilters(nextFilters)

    setFilters(next)
    setDraftFilters(next)

    resetPage()
    setFilterDrawerOpen(false)
  }

  /*
   * Cmd/Ctrl + K opens the drawer with current filters.
   */
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") {
        return
      }

      if (!(event.metaKey || event.ctrlKey)) {
        return
      }

      const target = event.target as HTMLElement

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return
      }

      event.preventDefault()

      setDraftFilters(cloneFilters(filters))
      setFilterDrawerOpen(true)
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [filters])

  if (query.isPending) {
    return <div>Loading...</div>
  }

  if (query.isError) {
    return <div>{query.error.message}</div>
  }

  if (!query.isSuccess) {
    return null
  }

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.companies.length > 0 ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo) ||
    Boolean(filters.phone) ||
    Boolean(filters.email)

  return (
    <section className="space-y-4 p-4">
      {/* Advanced filters */}
      <div className="flex justify-end gap-2">
        <Drawer
          open={filterDrawerOpen}
          onOpenChange={setFilterDrawerOpen}
          swipeDirection="right"
          showSwipeHandle
        >
          <DrawerTrigger
            render={
              <Button variant="outline" onClick={handleFilterDrawerOpen}>
                <SlidersHorizontal />
                Advanced Filters
              </Button>
            }
          />

          <AdvanceFilterDrawer
            filters={draftFilters}
            companies={companies}
            onFiltersChange={handleDraftFiltersChange}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            onApplySavedFilter={handleApplySavedFilter}
          />
        </Drawer>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters}>
            <X />
            Clear all
          </Button>
        )}
      </div>

      {/* Basic filters */}
      <CustomerFilters
        search={searchInput}
        filters={filters}
        companies={companies}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCompanyChange={handleCompanyChange}
        onAddCustomer={() => {
          console.log("Add customer")
        }}
      />

      {/* Table */}
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
