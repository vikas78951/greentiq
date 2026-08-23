import { savedFilters } from "@/features/saved-filters/data/saved-filters"
import {
  createSavedFilterSchema,
  type CreateSavedFilterInput,
} from "@/features/saved-filters/schemas/saved-filter-schema"

import type { SavedFilter } from "@/features/saved-filters/types/types"
import { ApiResponse } from "@/types/types"
import { readJsonBody } from "@/lib/request"

export function getSavedFilters(): Response {
  const result = [...savedFilters].sort((a, b) => a.order - b.order)

  const response: ApiResponse<SavedFilter[]> = {
    data: result,
  }

  return Response.json(response)
}

export async function createSavedFilter(request: Request): Promise<Response> {
  const bodyResult = await readJsonBody(request)

  if (!bodyResult.success) {
    return bodyResult.response
  }

  const result = createSavedFilterSchema.safeParse(bodyResult.data)

  if (!result.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid saved filter data",
          details: result.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const input: CreateSavedFilterInput = result.data

  const duplicate = savedFilters.some(
    (filter) => filter.name.toLowerCase() === input.name.toLowerCase()
  )

  if (duplicate) {
    return Response.json(
      {
        error: {
          code: "SAVED_FILTER_NAME_EXISTS",
          message: "A saved filter with this name already exists",
        },
      },
      { status: 409 }
    )
  }

  const now = new Date().toISOString()

  const nextOrder =
    savedFilters.length > 0
      ? Math.max(...savedFilters.map((filter) => filter.order)) + 1
      : 0

  const savedFilter: SavedFilter = {
    id: crypto.randomUUID(),
    name: input.name,
    filters: input.filters,
    order: nextOrder,
    createdAt: now,
    updatedAt: now,
  }

  savedFilters.push(savedFilter)

  const response: ApiResponse<SavedFilter> = {
    data: savedFilter,
  }

  return Response.json(response, { status: 201 })
}
