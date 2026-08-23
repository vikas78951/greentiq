"use client"

import * as React from "react"
import { Save, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useSavedFilters } from "@/features/saved-filters/hooks/use-saved-filters"
import { useCreateSavedFilter } from "@/features/saved-filters/hooks/use-create-saved-filter"
import { useUpdateSavedFilter } from "@/features/saved-filters/hooks/use-update-saved-filter"

import type {
  CustomerStatus,
  FilterState,
} from "@/features/customers/types/types"

type AdvanceFilterDrawerProps = {
  filters: FilterState
  companies: string[]
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>
  onApply: (filters: FilterState) => void
  onClear: () => void
  onApplySavedFilter: (filters: FilterState) => void
}

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

function getFilterCount(filters: FilterState) {
  let count = 0

  if (filters.status.length > 0) count++
  if (filters.companies.length > 0) count++
  if (filters.dateFrom || filters.dateTo) count++
  if (filters.phone) count++
  if (filters.email) count++

  return count
}

export function AdvanceFilterDrawer({
  filters,
  companies,
  onFiltersChange,
  onApply,
  onClear,
  onApplySavedFilter,
}: AdvanceFilterDrawerProps) {
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)

  const [saveName, setSaveName] = React.useState("")

  const [replaceDialogOpen, setReplaceDialogOpen] = React.useState(false)

  const [existingFilter, setExistingFilter] = React.useState<{
    id: string
    name: string
    filters: FilterState
  } | null>(null)

  const { data: savedFilters = [], isLoading } = useSavedFilters()

  const createSavedFilter = useCreateSavedFilter()

  const updateSavedFilter = useUpdateSavedFilter()

  const filterCount = getFilterCount(filters)

  const handleStatusChange = (status: CustomerStatus, checked: boolean) => {
    onFiltersChange((previous) => ({
      ...previous,
      status: checked
        ? previous.status.includes(status)
          ? previous.status
          : [...previous.status, status]
        : previous.status.filter((item) => item !== status),
    }))
  }

  const handleCompanyChange = (company: string, checked: boolean) => {
    onFiltersChange((previous) => ({
      ...previous,
      companies: checked
        ? previous.companies.includes(company)
          ? previous.companies
          : [...previous.companies, company]
        : previous.companies.filter((item) => item !== company),
    }))
  }

  const handleSaveFilter = () => {
    const name = saveName.trim()

    if (!name) {
      return
    }

    const existing = savedFilters.find(
      (filter) => filter.name.trim().toLowerCase() === name.toLowerCase()
    )

    if (existing) {
      setExistingFilter(existing)
      setSaveDialogOpen(false)
      setReplaceDialogOpen(true)
      return
    }

    createSavedFilter.mutate(
      {
        name,
        filters: cloneFilters(filters),
      },
      {
        onSuccess: () => {
          toast.success("Filter saved")
          setSaveName("")
          setSaveDialogOpen(false)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const handleReplaceFilter = () => {
    if (!existingFilter) {
      return
    }

    updateSavedFilter.mutate(
      {
        id: existingFilter.id,
        filters: cloneFilters(filters),
      },
      {
        onSuccess: () => {
          toast.success("Filter replaced successfully")
          setReplaceDialogOpen(false)
          setExistingFilter(null)
          setSaveName("")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <>
      <DrawerContent className="h-screen w-full sm:max-w-lg">
        <DrawerHeader className="relative w-full border-b">
          <DrawerTitle className="text-2xl">Advanced Filters</DrawerTitle>

          <DrawerClose
            render={
              <Button variant="ghost" className="absolute top-2 right-2">
                <X />
              </Button>
            }
          />
        </DrawerHeader>

        <div className="mt-4 flex-1 overflow-y-auto px-2">
          <div className="space-y-6">
            {/* STATUS */}
            <section className="space-y-3">
              <Label>Status</Label>

              <div className="flex items-center gap-4">
                {(["active", "inactive"] as const).map((status) => (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      checked={filters.status.includes(status)}
                      onCheckedChange={(checked) => {
                        handleStatusChange(status, checked === true)
                      }}
                    />

                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* COMPANY */}
            <section className="space-y-3">
              <Label>Company</Label>

              <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                {companies.map((company) => (
                  <label
                    key={company}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      checked={filters.companies.includes(company)}
                      onCheckedChange={(checked) => {
                        handleCompanyChange(company, checked === true)
                      }}
                    />

                    <span className="text-sm">{company}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* DATE RANGE */}
            <section className="space-y-3">
              <Label>Last Contacted</Label>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">From</Label>

                  <Input
                    type="date"
                    value={filters.dateFrom ?? ""}
                    onChange={(event) =>
                      onFiltersChange((previous) => ({
                        ...previous,
                        dateFrom: event.target.value || undefined,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">To</Label>

                  <Input
                    type="date"
                    value={filters.dateTo ?? ""}
                    onChange={(event) =>
                      onFiltersChange((previous) => ({
                        ...previous,
                        dateTo: event.target.value || undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </section>

            {/* PHONE / EMAIL */}
            <section className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="filter-phone">Phone</Label>

                <Input
                  id="filter-phone"
                  placeholder="Search phone..."
                  value={filters.phone ?? ""}
                  onChange={(event) =>
                    onFiltersChange((previous) => ({
                      ...previous,
                      phone: event.target.value || undefined,
                    }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="filter-email">Email</Label>

                <Input
                  id="filter-email"
                  placeholder="Search email..."
                  value={filters.email ?? ""}
                  onChange={(event) =>
                    onFiltersChange((previous) => ({
                      ...previous,
                      email: event.target.value || undefined,
                    }))
                  }
                />
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onFiltersChange(cloneFilters(emptyFilters))
                  onClear()
                }}
              >
                <X />
                Clear
              </Button>

              <Button className="flex-1" onClick={() => onApply(filters)}>
                Apply Filters
              </Button>

              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setSaveName("")
                  setSaveDialogOpen(true)
                }}
                disabled={filterCount === 0}
              >
                <Save />
                Save Filter
              </Button>
            </div>

            {/* SAVED FILTERS */}
            <section className="space-y-3 border-t pt-5">
              <div>
                <h3 className="text-sm font-medium">Saved Filters</h3>

                <p className="text-xs text-muted-foreground">
                  Apply a previously saved filter.
                </p>
              </div>

              {isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading saved filters...
                </div>
              ) : savedFilters.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No saved filters.
                </div>
              ) : (
                <div className="space-y-2">
                  {savedFilters.map((savedFilter) => (
                    <div
                      key={savedFilter.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {savedFilter.name}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {getFilterCount(savedFilter.filters)} filters
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApplySavedFilter(savedFilter.filters)}
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <DrawerFooter>
          {filterCount > 0 && (
            <div className="text-center text-xs text-muted-foreground">
              {filterCount} active filter
              {filterCount !== 1 ? "s" : ""}
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>

      {/* SAVE FILTER */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Filter</DialogTitle>

            <DialogDescription>
              Give this filter combination a name so you can quickly apply it
              later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="save-filter-name">Filter name</Label>

            <Input
              id="save-filter-name"
              value={saveName}
              onChange={(event) => setSaveName(event.target.value)}
              placeholder="e.g. Active Customers"
              maxLength={50}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleSaveFilter}
              disabled={
                !saveName.trim() ||
                createSavedFilter.isPending ||
                filterCount === 0
              }
            >
              {createSavedFilter.isPending ? "Saving..." : "Save Filter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REPLACE EXISTING */}
      <AlertDialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace existing filter?</AlertDialogTitle>

            <AlertDialogDescription>
              A filter named{" "}
              <span className="font-medium text-foreground">
                &quot;{existingFilter?.name}&quot;
              </span>{" "}
              already exists. Replacing it will overwrite its current filter
              configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateSavedFilter.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleReplaceFilter}
              disabled={updateSavedFilter.isPending}
            >
              {updateSavedFilter.isPending ? "Replacing..." : "Replace"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
