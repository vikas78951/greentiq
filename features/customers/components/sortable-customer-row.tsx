"use client"

import { useSortable } from "@dnd-kit/react/sortable"

import { TableCell, TableRow } from "@/components/ui/table"

import { cn } from "@/lib/utils"

import type { Row, RowData } from "@tanstack/react-table"

import { features } from "./table-features"

type SortableCustomerRowProps<TData extends RowData> = {
  row: Row<typeof features, TData>
  enabled?: boolean
  renderCell: (
    cell: ReturnType<Row<typeof features, TData>["getVisibleCells"]>[number]
  ) => React.ReactNode
}

export function SortableCustomerRow<TData extends RowData>({
  row,
  enabled = true,
  renderCell,
}: SortableCustomerRowProps<TData>) {
  const { ref, isDragging } = useSortable({
    id: row.id,
    index: row.index,
    disabled: !enabled,
  })

  return (
    <TableRow
      ref={ref}
      data-state={row.getIsSelected() ? "selected" : undefined}
      className={cn(
        enabled && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(cell.column.columnDef.meta?.className)}
        >
          {renderCell(cell)}
        </TableCell>
      ))}
    </TableRow>
  )
}
