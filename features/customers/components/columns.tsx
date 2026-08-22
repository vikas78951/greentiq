"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

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

const columnHelper = createColumnHelper<typeof features, Customer>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",

    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? undefined
              : false
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value)
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
  }),

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
        <div className="flex items-center gap-3">
          <Avatar>
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

  columnHelper.accessor("phone", {
    header: "Phone",
  }),

  columnHelper.accessor("company", {
    header: "Company",
  }),

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

  columnHelper.accessor("lastContactDate", {
    header: "Last Contact",
  }),

  columnHelper.display({
    id: "actions",

    header: "Actions",

    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
          >
            <span className="sr-only">Open actions for {customer.name}</span>

            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem>View customer</DropdownMenuItem>

            <DropdownMenuItem>Edit customer</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive">
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
