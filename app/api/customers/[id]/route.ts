import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from "@/features/customers/services/customer-service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { id } = await params

  return getCustomerById(id)
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { id } = await params

  return updateCustomer(id, request)
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { id } = await params

  return deleteCustomer(id)
}

