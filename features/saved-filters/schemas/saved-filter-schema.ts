import { z } from "zod"

export const savedFilterFiltersSchema = z.object({
    status: z
        .array(z.enum(["active", "inactive"]))
        .default([]),
    companies: z
        .array(z.string().trim())
        .default([]),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().optional(),
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

export type CreateSavedFilterInput = z.infer<
    typeof createSavedFilterSchema
>

export type ReorderSavedFiltersInput = z.infer<
    typeof reorderSavedFiltersSchema
>

export const updateSavedFilterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Filter name is required")
    .max(50, "Filter name must be 50 characters or less")
    .optional(),

  filters: savedFilterFiltersSchema.optional(),
})

export type UpdateSavedFilterInput = z.infer<
  typeof updateSavedFilterSchema
>
