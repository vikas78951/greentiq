"use client"

import { Search, Plus } from "lucide-react"

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
type StatusSelectValue = CustomerStatus | "all"
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
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value)
          }}
          placeholder="Search name, email or company..."
          className="pl-9"
        />
      </div>

      {/* Status */}
      <Select
        value={filters.status[0] ?? "all"}
        onValueChange={(value) => {
          if (value === "active" || value === "inactive") {
            onStatusChange(value)
          } else {
            onStatusChange(undefined)
            return
          }
        }}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>

          <SelectItem value="active">Active</SelectItem>

          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Company */}
      <Select
        value={filters.companies[0] ?? "all"}
        onValueChange={(value) => {
          if (value === null || value === "all") {
            onCompanyChange(undefined)
            return
          }

          onCompanyChange(value)
        }}
      >
        <SelectTrigger className="w-45">
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
        Add Customer
      </Button>
    </div>
  )
}
