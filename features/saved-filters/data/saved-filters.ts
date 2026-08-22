import type { SavedFilter } from "@/features/saved-filters/types/types"

export const savedFilters: SavedFilter[] = [
  {
    id: crypto.randomUUID(),
    name: "Active Customers",
    filters: {
      status: ["active"],
      companies: [],
    },
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Inactive Leads",
    filters: {
      status: ["inactive"],
      companies: [],
    },
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Recent Contacts",
    filters: {
      status: [],
      companies: [],
    },
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
