"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Loader2, Trash2 } from "lucide-react"

import type { Customer } from "@/features/customers/types/types"
import { Button } from "@/components/ui/button"

type CustomerDeleteDialogProps = {
  customer: Customer | null
  count?: number
  open: boolean
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CustomerDeleteDialog({
  customer,
  count = 1,
  open,
  isPending = false,
  onOpenChange,
  onConfirm,
}: CustomerDeleteDialogProps) {
  const isBulk = count > 1

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex gap-4 items-center">
            {/* ICON */}
            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-5 text-destructive" />
            </div>

            {/* TITLE */}
            <AlertDialogTitle>
              {isBulk
                ? `Delete ${count} customers?`
                : "Delete customer?"}
            </AlertDialogTitle>


          </div>
          {/* DESCRIPTION */}
          <AlertDialogDescription className="w-full">
            You are about to permanently delete{" "}
            {isBulk ? (
              <span className="font-medium text-foreground">
                {count} customers
              </span>
            ) : (
              <span className="font-medium text-foreground">
                {customer?.name}
              </span>
            )}
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <Button
          variant='destructive'
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 />
                {isBulk
                  ? `Delete ${count} customers`
                  : "Delete customer"}
              </>
            )}
          </Button>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}