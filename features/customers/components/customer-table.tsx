"use client"

import * as React from "react"

import {
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
  type ColumnVisibilityState,
  type PaginationState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { features } from "./table-features"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[]
  data: TData[]

  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }

  paginationState: PaginationState

  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  pagination,
  paginationState,
  onPaginationChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useTable({
    features,
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    manualPagination: true,
    pageCount: pagination?.totalPages,
    manualSorting: true,
  })

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline">Columns</Button>}
          >
            Columns
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => {
                    column.toggleVisibility(!!value)
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : table.FlexRender({
                          header,
                        })}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {table.FlexRender({
                        cell,
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {pagination?.total} customer
          {pagination?.total !== 1 ? "s" : ""}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>

            <Select
              value={String(paginationState.pageSize)}
              onValueChange={(value) => {
                const pageSize = Number(value)

                onPaginationChange({
                  pageIndex: 0,
                  pageSize,
                })
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm">
            Page {pagination?.page} of {pagination?.totalPages}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
