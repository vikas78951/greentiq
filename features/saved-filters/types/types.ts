import { FilterState } from "@/features/customers/types/types"

export interface SavedFilter {
  id: string
  name: string
  filters: FilterState
  order: number
  createdAt: string
  updatedAt: string
}
