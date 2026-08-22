import {
  createSavedFilter,
  getSavedFilters,
} from "@/features/saved-filters/services/saved-filter-service"

export const GET = getSavedFilters

export const POST = createSavedFilter
