"use client"

import * as React from "react"

import { DragDropProvider } from "@dnd-kit/react"
import { isSortable, useSortable } from "@dnd-kit/react/sortable"

import {
  useTable,
  type ColumnDef,
  type Row,
  type RowData,
  type SortingState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

  rowSelection: RowSelectionState

  onRowSelectionChange: React.Dispatch<React.SetStateAction<RowSelectionState>>

  onReorder?: (activeId: string, overId: string) => void
}

type SortableTableRowProps<TData extends RowData> = {
  row: Row<typeof features, TData>
  renderCells: () => React.ReactNode
}

function SortableTableRow<TData extends RowData>({
  row,
  renderCells,
}: SortableTableRowProps<TData>) {
  const { ref, isDragging } = useSortable({
    id: row.id,
    index: row.index,
  })

  return (
    <TableRow
      ref={ref}
      data-state={row.getIsSelected() ? "selected" : undefined}
      className={cn("cursor-grab", isDragging && "opacity-50")}
    >
      {renderCells()}
    </TableRow>
  )
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  pagination,
  paginationState,
  onPaginationChange,
  rowSelection,
  onRowSelectionChange,
  onReorder,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const table = useTable({
    features,
    data,
    columns,

    getRowId: (row) => String((row as { id: string }).id),

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },

    enableRowSelection: true,

    onSortingChange: setSorting,

    onColumnVisibilityChange: setColumnVisibility,

    onRowSelectionChange,

    onPaginationChange,

    manualPagination: true,

    pageCount: pagination?.totalPages ?? 0,

    manualSorting: true,
  })

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[640px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(header.column.columnDef.meta?.className)}
                  >
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

          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled || !onReorder) {
                return
              }

              const { source, target } = event.operation

              if (!source || !target) {
                return
              }

              if (!isSortable(source) || !isSortable(target)) {
                return
              }

              const activeId = String(source.id)

              const overId = String(target.id)

              if (activeId === overId) {
                return
              }

              onReorder(activeId, overId)
            }}
          >
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <SortableTableRow
                    key={row.id}
                    row={row}
                    renderCells={() =>
                      row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(cell.column.columnDef.meta?.className)}
                        >
                          {table.FlexRender({
                            cell,
                          })}
                        </TableCell>
                      ))
                    }
                  />
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
          </DragDropProvider>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {pagination?.total ?? 0} customer
          {(pagination?.total ?? 0) !== 1 ? "s" : ""}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Rows per page
            </span>

            <Select
              value={String(paginationState.pageSize)}
              onValueChange={(value) => {
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: Number(value),
                })
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10</SelectItem>

                <SelectItem value="25">25</SelectItem>

                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm whitespace-nowrap">
            Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
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
