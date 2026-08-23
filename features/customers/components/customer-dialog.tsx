"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { CustomerForm } from "./customer-form"

import { useCreateCustomer } from "@/features/customers/hooks/use-create-customer"
import { useUpdateCustomer } from "@/features/customers/hooks/use-update-customer"

import type { Customer } from "@/features/customers/types/types"
import type { CreateCustomerInput } from "@/features/customers/schemas/customer-schema"

type CustomerDialogProps = {
  open: boolean
  customer: Customer | null
  readOnly?: boolean
  onEdit?: () => void
  onOpenChange: (open: boolean) => void
}

export function CustomerDialog({
  open,
  customer,
  readOnly = false,
  onEdit,
  onOpenChange,
}: CustomerDialogProps) {
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()

  const isEdit = customer !== null
  const isPending = createCustomer.isPending || updateCustomer.isPending

  const handleSubmit = (data: CreateCustomerInput) => {
    if (customer) {
      updateCustomer.mutate(
        {
          id: customer.id,
          data,
        },
        {
          onSuccess: () => {
            toast.success("Customer updated successfully")
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )

      return
    }

    createCustomer.mutate(data, {
      onSuccess: () => {
        toast.success("Customer created successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>

          <DialogDescription>
            {isEdit ? "Update customer information." : "Add a new customer."}
          </DialogDescription>
        </DialogHeader>

        <CustomerForm
          key={`${customer?.id ?? "new"}-${readOnly}`}
          defaultValues={customer ?? undefined}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={isEdit ? "Update Customer" : "Add Customer"}
          readOnly={readOnly}
          onEdit={onEdit}
        />
      </DialogContent>
    </Dialog>
  )
}
