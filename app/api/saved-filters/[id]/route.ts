import { savedFilters } from "@/features/saved-filters/data/saved-filters"
import {
  UpdateSavedFilterInput,
  updateSavedFilterSchema,
} from "@/features/saved-filters/schemas/saved-filter-schema"

import type { SavedFilter } from "@/features/saved-filters/types/types"
import { ApiResponse } from "@/types/types"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { id } = await params

  const index = savedFilters.findIndex((filter) => filter.id === id)

  if (index === -1) {
    return Response.json(
      {
        error: {
          code: "SAVED_FILTER_NOT_FOUND",
          message: "Saved filter not found",
        },
      },
      { status: 404 }
    )
  }

  const [deletedFilter] = savedFilters.splice(index, 1)

  // Re-normalize ordering.
  savedFilters
    .sort((a, b) => a.order - b.order)
    .forEach((filter, index) => {
      filter.order = index
    })

  const response: ApiResponse<SavedFilter> = {
    data: deletedFilter,
  }

  return Response.json(response)
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { id } = await params

  const savedFilter = savedFilters.find((filter) => filter.id === id)

  if (!savedFilter) {
    return Response.json(
      {
        error: {
          code: "SAVED_FILTER_NOT_FOUND",
          message: "Saved filter not found",
        },
      },
      { status: 404 }
    )
  }

  const body: unknown = await request.json()

  const result = updateSavedFilterSchema.safeParse(body)

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

  const input: UpdateSavedFilterInput = result.data

  if (input.name !== undefined) {
    const duplicate = savedFilters.some(
      (filter) =>
        filter.id !== id &&
        filter.name.toLowerCase() === input?.name?.toLowerCase()
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

    savedFilter.name = input.name
  }

  if (input.filters !== undefined) {
    savedFilter.filters = input.filters
  }

  savedFilter.updatedAt = new Date().toISOString()

  const response: ApiResponse<SavedFilter> = {
    data: savedFilter,
  }

  return Response.json(response)
}
