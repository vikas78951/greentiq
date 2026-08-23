import { reorderSavedFiltersSchema } from "@/features/saved-filters/schemas/saved-filter-schema"
import { savedFilters } from "@/features/saved-filters/data/saved-filters"

import type { SavedFilter } from "@/features/saved-filters/types/types"
import type { ApiResponse } from "@/types/types"
import { readJsonBody } from "@/lib/request"

export async function PATCH(request: Request): Promise<Response> {
  const bodyResult = await readJsonBody(request)

  if (!bodyResult.success) {
    return bodyResult.response
  }

  const result = reorderSavedFiltersSchema.safeParse(bodyResult.data)

  if (!result.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid reorder data",
          details: result.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const items = result.data.items

  if (items.length !== savedFilters.length) {
    return Response.json(
      {
        error: {
          code: "INVALID_REORDER",
          message: "All saved filters must be included when reordering",
        },
      },
      { status: 400 }
    )
  }

  const receivedIds = new Set(items.map((item) => item.id))

  if (receivedIds.size !== items.length) {
    return Response.json(
      {
        error: {
          code: "DUPLICATE_SAVED_FILTER_ID",
          message: "Duplicate saved filter IDs are not allowed",
        },
      },
      { status: 400 }
    )
  }

  const existingIds = new Set(savedFilters.map((filter) => filter.id))

  const unknownItem = items.find((item) => !existingIds.has(item.id))

  if (unknownItem) {
    return Response.json(
      {
        error: {
          code: "INVALID_SAVED_FILTER_ID",
          message: `Saved filter not found: ${unknownItem.id}`,
        },
      },
      { status: 400 }
    )
  }

  const orders = items.map((item) => item.order)

  const expectedOrders = Array.from(
    { length: savedFilters.length },
    (_, index) => index
  )

  const hasValidOrders =
    new Set(orders).size === orders.length &&
    orders.every((order) => expectedOrders.includes(order))

  if (!hasValidOrders) {
    return Response.json(
      {
        error: {
          code: "INVALID_ORDER",
          message: "Orders must be unique and sequential starting from 0",
        },
      },
      { status: 400 }
    )
  }

  const orderMap = new Map(items.map((item) => [item.id, item.order]))

  const now = new Date().toISOString()

  for (const filter of savedFilters) {
    const newOrder = orderMap.get(filter.id)

    if (newOrder !== undefined) {
      filter.order = newOrder
      filter.updatedAt = now
    }
  }

  const data = [...savedFilters].sort((a, b) => a.order - b.order)

  const response: ApiResponse<SavedFilter[]> = {
    data,
  }

  return Response.json(response)
}
