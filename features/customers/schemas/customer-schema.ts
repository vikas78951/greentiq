import { z } from "zod"

export const customerStatusSchema = z.enum(["active", "inactive"])

export const customerGenderSchema = z.enum(["male", "female"])

const dateSchema = z.iso.date("Invalid date")

export const sortBySchema = z.enum(["name", "email", "lastContactDate"])

export const sortOrderSchema = z.enum(["asc", "desc"])

export const customerQuerySchema = z
  .object({
    search: z.string().trim().toLowerCase().optional(),

    filters: z.object({
      status: z.array(customerStatusSchema).default([]),
      companies: z.array(z.string().trim()).default([]),
      dateFrom: dateSchema.optional(),
      dateTo: dateSchema.optional(),
      phone: z.string().trim().toLowerCase().optional(),
      email: z.string().trim().toLowerCase().optional(),
    }),

    sortBy: sortBySchema.optional(),

    sortOrder: sortOrderSchema.optional(),

    page: z.number().int().positive(),

    pageSize: z.union([z.literal(10), z.literal(25), z.literal(50)]),
  })
  .superRefine((query, context) => {
    if (
      query.filters.dateFrom &&
      query.filters.dateTo &&
      query.filters.dateFrom > query.filters.dateTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["filters", "dateTo"],
        message: "End date must be on or after the start date",
      })
    }
  })

const customerFieldsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address")),

  phone: z.string().trim().min(7, "Invalid phone number"),

  company: z.string().trim().min(2, "Company is required"),

  status: customerStatusSchema,

  gender: customerGenderSchema,

  avatar: z.string().url("Invalid avatar URL").optional(),

  lastContactDate: dateSchema,

  notes: z.string().trim().default(""),
})

export const createCustomerSchema = customerFieldsSchema

export const updateCustomerSchema = customerFieldsSchema.partial()

export type CreateCustomerInput = z.output<typeof createCustomerSchema>

export type CreateCustomerFormInput = z.input<typeof createCustomerSchema>

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
