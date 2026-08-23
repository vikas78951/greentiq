"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import type { Customer } from "@/features/customers/types/types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { features } from "./table-features"

type CustomerColumnActions = {
  onView: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

const columnHelper = createColumnHelper<typeof features, Customer>()

export function createColumns({
  onView,
  onEdit,
  onDelete,
}: CustomerColumnActions) {
  return columnHelper.columns([
    // SELECT
    columnHelper.display({
      id: "select",

      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(value === true)
          }}
          aria-label="Select all customers"
        />
      ),

      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          aria-label={`Select ${row.original.name}`}
        />
      ),

      enableSorting: false,
      enableHiding: false,

      meta: {
        className: "hidden sm:table-cell",
      },
    }),

    // CUSTOMER
    columnHelper.display({
      id: "customer",

      header: "Customer",

      cell: ({ row }) => {
        const customer = row.original

        const initials = customer.name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-8 shrink-0">
              {customer.avatar && (
                <AvatarImage src={customer.avatar} alt={customer.name} />
              )}

              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="truncate font-medium">{customer.name}</div>

              <div className="truncate text-sm text-muted-foreground">
                {customer.email}
              </div>
            </div>
          </div>
        )
      },
    }),

    // PHONE
    columnHelper.accessor("phone", {
      header: "Phone",

      meta: {
        className: "hidden sm:table-cell",
      },
    }),

    // COMPANY
    columnHelper.accessor("company", {
      header: "Company",
    }),

    // STATUS
    columnHelper.accessor("status", {
      header: "Status",

      cell: ({ row }) => {
        const status = row.original.status

        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        )
      },
    }),

    // LAST CONTACT
    columnHelper.accessor("lastContactDate", {
      header: "Last Contact",

      meta: {
        className: "hidden sm:table-cell",
      },
    }),

    // ACTIONS
    columnHelper.display({
      id: "actions",

      header: "Actions",

      cell: ({ row }) => {
        const customer = row.original

        return (
          <div className="flex items-center justify-between gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onView(customer)}
              aria-label={`View ${customer.name}`}
              title="View customer"
            >
              <Eye />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onEdit(customer)}
              aria-label={`Edit ${customer.name}`}
              title="Edit customer"
            >
              <Pencil />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(customer)}
              aria-label={`Delete ${customer.name}`}
              title="Delete customer"
            >
              <Trash2 />
            </Button>
          </div>
        )
      },
    }),
  ])
}
