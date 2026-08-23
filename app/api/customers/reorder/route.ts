import { customers } from "@/features/customers/data/customers"

type ReorderCustomerInput = {
  activeId: string
  overId: string
}

export async function PATCH(request: Request): Promise<Response> {
  const body = (await request.json()) as Partial<ReorderCustomerInput>

  if (!body.activeId || !body.overId) {
    return Response.json(
      {
        error: {
          code: "INVALID_REORDER",
          message: "activeId and overId are required",
        },
      },
      { status: 400 }
    )
  }

  if (body.activeId === body.overId) {
    return Response.json({
      data: customers,
    })
  }

  const activeIndex = customers.findIndex(
    (customer) => customer.id === body.activeId
  )

  const overIndex = customers.findIndex(
    (customer) => customer.id === body.overId
  )

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
