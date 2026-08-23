"use client"

import { Search, Plus, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type {
  CustomerStatus,
  FilterState,
} from "@/features/customers/types/types"

type CustomerFiltersProps = {
  search: string
  filters: FilterState
  companies: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (status: CustomerStatus | undefined) => void
  onCompanyChange: (company: string | undefined) => void
  onAddCustomer: () => void
}

export function CustomerFilters({
  search,
  filters,
  companies,
  onSearchChange,
  onStatusChange,
  onCompanyChange,
  onAddCustomer,
}: CustomerFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value)
          }}
          placeholder="Search name, email or company..."
          className="pr-9 pl-9"
        />

        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 size-7"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <Select
        value={filters.status[0] ?? "all"}
        onValueChange={(value) => {
          if (value === "active" || value === "inactive") {
            onStatusChange(value)
          } else {
            onStatusChange(undefined)
          }
        }}
      >
        <SelectTrigger className="w-20 md:w-45">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.companies[0] ?? "all"}
        onValueChange={(value) => {
          if (!value || value === "all") {
            onCompanyChange(undefined)
          } else {
            onCompanyChange(value)
          }
        }}
      >
        <SelectTrigger className="w-20 md:w-45">
          <SelectValue placeholder="Company" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>

          {companies.map((company) => (
            <SelectItem key={company} value={company}>
              {company}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={onAddCustomer}>
        <Plus />
        <span className="hidden sm:block">Add Customer</span>
      </Button>
    </div>
  )
}
