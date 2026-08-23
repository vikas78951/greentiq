"use client"

import * as React from "react"
import { toast } from "sonner"
import { SlidersHorizontal, X } from "lucide-react"
import dynamic from "next/dynamic"
import type { Customer } from "@/features/customers/types/types"

import type {
  CustomerStatus,
  FilterState,
} from "@/features/customers/types/types"

import { useCustomers } from "@/features/customers/hooks/use-customers"
import { useDebounce } from "@/hooks/use-debounce"
import { CustomerTableSkeleton } from "@/features/customers/components/customer-table-skeleton"
import { AdvanceFilterDrawer } from "@/features/customers/components/advance-filter"
import { CustomerFilters } from "@/features/customers/components/customer-filters"
import { DataTable } from "@/features/customers/components/customer-table"
import { companies } from "@/features/customers/data/customers"
import { createColumns } from "@/features/customers/components/columns"
import { useDeleteCustomer } from "@/features/customers/hooks/use-delete-customer"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"

import { Download, Trash2 } from "lucide-react"
import type { RowSelectionState } from "@tanstack/react-table"

const CustomerDialog = dynamic(() =>
  import("@/features/customers/components/customer-dialog").then(
    (module) => module.CustomerDialog
  )
)
const CustomerDeleteDialog = dynamic(() =>
  import("@/features/customers/components/customer-delete-dialog").then(
    (module) => module.CustomerDeleteDialog
  )
)

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
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const query = useCustomers({
    search: search || undefined,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize as 10 | 25 | 50,
    filters,
  })

  const [customerDialogOpen, setCustomerDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [customersToDelete, setCustomersToDelete] = React.useState<Customer[]>(
    []
  )

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
    setCustomersToDelete([customer])
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = React.useCallback(async () => {
    if (customersToDelete.length === 0) {
      return
    }

    const customers = [...customersToDelete]
    const count = customers.length

    try {
      await Promise.all(
        customers.map((customer) => deleteCustomer.mutateAsync(customer.id))
      )

      setDeleteDialogOpen(false)
      setCustomersToDelete([])
      setRowSelection({})

      toast.success(`${count} customer${count > 1 ? "s" : ""} deleted`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed")
    }
  }, [customersToDelete, deleteCustomer])

  const columns = React.useMemo(
    () =>
      createColumns({
        onView: handleViewCustomer,
        onEdit: handleEditCustomer,
        onDelete: handleDeleteCustomer,
      }),
    [handleViewCustomer, handleEditCustomer, handleDeleteCustomer]
  )

  const selectedCustomers = React.useMemo(() => {
    return (
      query.data?.data.filter((customer) => rowSelection[customer.id]) ?? []
    )
  }, [query.data?.data, rowSelection])

  const handleExportSelected = React.useCallback(() => {
    if (selectedCustomers?.length === 0) {
      toast.error("Select at least one customer")
      return
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Gender",
      "Last Contact Date",
      "Avatar",
      "Notes",
    ]

    const escapeCsv = (value: unknown) => {
      const stringValue = String(value ?? "")

      return `"${stringValue.replace(/"/g, '""')}"`
    }

    const rows = selectedCustomers?.map((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.status,
        customer.gender,
        customer.lastContactDate,
        customer.avatar,
        customer.notes,
      ]
        .map(escapeCsv)
        .join(",")
    )

    const csv = [headers.join(","), ...rows].join("\n")

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)

    toast.success(
      `${selectedCustomers?.length} customer${
        selectedCustomers?.length > 1 ? "s" : ""
      } exported`
    )
  }, [selectedCustomers])

  const handleBulkDelete = React.useCallback(() => {
    if (selectedCustomers.length === 0) {
      toast.error("Select at least one customer")
      return
    }

    setCustomersToDelete(selectedCustomers)
    setDeleteDialogOpen(true)
  }, [selectedCustomers])

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
    return (
      <section className="space-y-4 p-4">
        <CustomerTableSkeleton />
      </section>
    )
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
        {Object.keys(rowSelection).length > 0 && (
          <div className="flex items-center justify-end gap-2">
            <span className="mr-2 text-sm text-muted-foreground">
              {Object.keys(rowSelection).length} selected
            </span>

            <Button variant="outline" size="sm" onClick={handleExportSelected}>
              <Download />
              Export CSV
            </Button>

            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 />
              Delete selected
            </Button>
          </div>
        )}
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
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
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
        customer={customersToDelete.length === 1 ? customersToDelete[0] : null}
        count={customersToDelete.length}
        open={deleteDialogOpen}
        isPending={deleteCustomer.isPending}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
