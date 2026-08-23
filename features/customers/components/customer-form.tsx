"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  createCustomerSchema,
  type CreateCustomerInput,
  type CreateCustomerFormInput,
} from "@/features/customers/schemas/customer-schema"

type CustomerFormProps = {
  defaultValues?: Partial<CreateCustomerInput>
  onSubmit: (data: CreateCustomerInput) => void
  isPending?: boolean
  submitLabel: string
  readOnly?: boolean
  onEdit?: () => void
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel,
  readOnly = false,
  onEdit,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerFormInput, unknown, CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),

    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      company: defaultValues?.company ?? "",
      status: defaultValues?.status ?? "active",
      gender: defaultValues?.gender ?? "male",
      avatar: defaultValues?.avatar ?? "",
      lastContactDate: defaultValues?.lastContactDate ?? "",
      notes: defaultValues?.notes ?? "",
    },
  })

  const inputClassName = readOnly
    ? "border-0 px-0 shadow-none focus-visible:ring-0 !bg-transparent "
    : ""

  const selectClassName = readOnly
    ? "h-9 w-full appearance-none border-0 bg-none px-0 text-sm"
    : "h-9 w-full rounded-md border bg-background px-3 text-sm"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Name</Label>

          <Input
            {...register("name")}
            readOnly={readOnly}
            className={inputClassName}
          />

          {!readOnly && errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Email</Label>

          <Input
            type="email"
            {...register("email")}
            readOnly={readOnly}
            className={inputClassName}
          />

          {!readOnly && errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Phone</Label>

          <Input
            {...register("phone")}
            readOnly={readOnly}
            className={inputClassName}
          />

          {!readOnly && errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Company</Label>

          <Input
            {...register("company")}
            readOnly={readOnly}
            className={inputClassName}
          />

          {!readOnly && errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Last Contact Date</Label>

          <Input
            type="date"
            {...register("lastContactDate")}
            readOnly={readOnly}
            className={inputClassName}
          />

          {!readOnly && errors.lastContactDate && (
            <p className="text-sm text-destructive">
              {errors.lastContactDate.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Avatar URL</Label>

          <Input
            {...register("avatar")}
            readOnly={readOnly}
            className={inputClassName}
          />

          {!readOnly && errors.avatar && (
            <p className="text-sm text-destructive">{errors.avatar.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Status</Label>

          <select
            {...register("status")}
            disabled={readOnly}
            className={selectClassName}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-3">
          <Label>Gender</Label>

          <select
            {...register("gender")}
            disabled={readOnly}
            className={selectClassName}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Notes</Label>

        <textarea
          {...register("notes")}
          readOnly={readOnly}
          className={
            readOnly
              ? "min-h-24 w-full border-0 bg-background p-2 text-sm shadow-none focus:outline-none"
              : "min-h-24 w-full rounded-md border bg-background p-2 text-sm"
          }
        />

        {!readOnly && errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      {readOnly ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onEdit}
        >
          Edit Customer
        </Button>
      ) : (
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : submitLabel}
        </Button>
      )}
    </form>
  )
}
