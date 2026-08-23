"use client"

import * as React from "react"
import { toast } from "sonner"
import { SlidersHorizontal, X } from "lucide-react"

import { useCustomers } from "@/features/customers/hooks/use-customers"
import { useDebounce } from "@/hooks/use-debounce"

import { AdvanceFilterDrawer } from "@/features/customers/components/advance-filter"
import { CustomerFilters } from "@/features/customers/components/customer-filters"
import { DataTable } from "@/features/customers/components/customer-table"
import { CustomerDeleteDialog } from "@/features/customers/components/customer-delete-dialog"
import { companies } from "@/features/customers/data/customers"
import { createColumns } from "@/features/customers/components/columns"
import { CustomerDialog } from "@/features/customers/components/customer-dialog"
import { useDeleteCustomer } from "@/features/customers/hooks/use-delete-customer"

import type { Customer } from "@/features/customers/types/types"

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

  const [filters, setFilters] = React.useState<FilterState>(emptyFilters)

  const [draftFilters, setDraftFilters] =
    React.useState<FilterState>(emptyFilters)

  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false)

  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null)

  const [customerViewMode, setCustomerViewMode] = React.useState(false)

  const query = useCustomers({
    search: search || undefined,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize as 10 | 25 | 50,
    filters,
  })

  const [customerDialogOpen, setCustomerDialogOpen] = React.useState(false)
  const [customerToDelete, setCustomerToDelete] =
    React.useState<Customer | null>(null)

  const deleteCustomer = useDeleteCustomer()

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

  const handleFilterDrawerOpen = () => {
    setDraftFilters(cloneFilters(filters))
    setFilterDrawerOpen(true)
  }

  const handleDraftFiltersChange: React.Dispatch<
    React.SetStateAction<FilterState>
  > = (value) => {
    setDraftFilters(value)
  }

  const handleApplyFilters = (nextFilters: FilterState) => {
    const next = cloneFilters(nextFilters)

    setFilters(next)
    setDraftFilters(next)

    resetPage()
    setFilterDrawerOpen(false)
  }

  const handleClearFilters = () => {
    const empty = cloneFilters(emptyFilters)

    setFilters(empty)
    setDraftFilters(empty)

    resetPage()
  }

  const handleApplySavedFilter = (nextFilters: FilterState) => {
    const next = cloneFilters(nextFilters)

    setFilters(next)
    setDraftFilters(next)

    resetPage()
    setFilterDrawerOpen(false)
  }

  const handleAddCustomer = () => {
    setCustomerDialogOpen(true)
  }

  const handleViewCustomer = React.useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerViewMode(true)
    setCustomerDialogOpen(true)
  }, [])
  const handleEditCustomer = React.useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerViewMode(false)
    setCustomerDialogOpen(true)
  }, [])

  const handleDeleteCustomer = React.useCallback((customer: Customer) => {
    setCustomerToDelete(customer)
  }, [])

  const handleConfirmDelete = React.useCallback(() => {
    if (!customerToDelete) {
      return
    }

    deleteCustomer.mutate(customerToDelete.id, {
      onSuccess: () => {
        toast.success("Customer deleted successfully")
        setCustomerToDelete(null)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }, [customerToDelete, deleteCustomer])

  const columns = React.useMemo(
    () =>
      createColumns({
        onView: handleViewCustomer,
        onEdit: handleEditCustomer,
        onDelete: handleDeleteCustomer,
      }),
    [handleViewCustomer, handleEditCustomer, handleDeleteCustomer]
  )

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event?.key

      if (typeof key !== "string") {
        return
      }

      if (key !== "k" && key !== "K") {
        return
      }

      if (!(event.metaKey || event.ctrlKey)) {
        return
      }

      const target = event.target

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
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
        onAddCustomer={handleAddCustomer}
      />
      {/* Table */}
      <DataTable
        columns={columns}
        data={query.data.data}
        pagination={query.data.meta}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />

      <CustomerDialog
        open={customerDialogOpen}
        customer={selectedCustomer}
        readOnly={customerViewMode}
        onEdit={() => setCustomerViewMode(false)}
        onOpenChange={(open) => {
          setCustomerDialogOpen(open)

          if (!open) {
            setSelectedCustomer(null)
            setCustomerViewMode(false)
          }
        }}
      />

      <CustomerDeleteDialog
        customer={customerToDelete}
        open={customerToDelete !== null}
        isPending={deleteCustomer.isPending}
        onOpenChange={(open) => {
          if (!open && !deleteCustomer.isPending) {
            setCustomerToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
