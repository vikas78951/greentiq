"use client"

import { useQuery } from "@tanstack/react-query"

import type { SavedFilter } from "@/features/saved-filters/types/types"

interface SavedFiltersResponse {
  data: SavedFilter[]
}

async function fetchSavedFilters(): Promise<SavedFilter[]> {
  const response = await fetch("/api/saved-filters")

  if (!response.ok) {
    throw new Error("Failed to fetch saved filters")
  }

  const result: SavedFiltersResponse = await response.json()

  return result.data
}

export function useSavedFilters() {
  return useQuery({
    queryKey: ["saved-filters"],
    queryFn: fetchSavedFilters,
  })
}
