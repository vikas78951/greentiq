import { z } from "zod"

const dateSchema = z.iso.date("Invalid date")

export const savedFilterFiltersSchema = z
  .object({
    status: z.array(z.enum(["active", "inactive"])).default([]),
    companies: z.array(z.string().trim()).default([]),
    dateFrom: dateSchema.optional(),
    dateTo: dateSchema.optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
  })
  .superRefine((filters, context) => {
    if (
      filters.dateFrom &&
      filters.dateTo &&
      filters.dateFrom > filters.dateTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["dateTo"],
        message: "End date must be on or after the start date",
      })
    }
  })

export const createSavedFilterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Filter name is required")
    .max(50, "Filter name must be 50 characters or less"),

  filters: savedFilterFiltersSchema,
})

export const reorderSavedFiltersSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().nonnegative(),
    })
  ),
})

export type CreateSavedFilterInput = z.infer<typeof createSavedFilterSchema>

export type ReorderSavedFiltersInput = z.infer<typeof reorderSavedFiltersSchema>

export const updateSavedFilterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Filter name is required")
    .max(50, "Filter name must be 50 characters or less")
    .optional(),

  filters: savedFilterFiltersSchema.optional(),
})

export type UpdateSavedFilterInput = z.infer<typeof updateSavedFilterSchema>
