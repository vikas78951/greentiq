import { customers } from "@/features/customers/data/customers"
import { readJsonBody } from "@/lib/request"
import { z } from "zod"

const reorderCustomerSchema = z.object({
  activeId: z.string().trim().min(1),
  overId: z.string().trim().min(1),
})

export async function PATCH(request: Request): Promise<Response> {
  const bodyResult = await readJsonBody(request)

  if (!bodyResult.success) {
    return bodyResult.response
  }

  const result = reorderCustomerSchema.safeParse(bodyResult.data)

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

  const { activeId, overId } = result.data

  if (activeId === overId) {
    return Response.json({
      data: customers,
    })
  }

  const activeIndex = customers.findIndex(
    (customer) => customer.id === activeId
  )

  const overIndex = customers.findIndex((customer) => customer.id === overId)

  if (activeIndex === -1 || overIndex === -1) {
    return Response.json(
      {
        error: {
          code: "CUSTOMER_NOT_FOUND",
          message: "Customer not found",
        },
      },
      { status: 404 }
    )
  }

  const [activeCustomer] = customers.splice(activeIndex, 1)

  customers.splice(overIndex, 0, activeCustomer)

  const now = new Date().toISOString()

  customers.forEach((customer, index) => {
    customer.order = index
    customer.updatedAt = now
  })

  return Response.json({
    data: [...customers],
  })
}
