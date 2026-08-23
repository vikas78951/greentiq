"use client"

import { Skeleton } from "@/components/ui/skeleton"

const ROWS = 10

export function CustomerTableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <div className="grid grid-cols-[48px_minmax(220px,1fr)_160px_180px_120px_160px_140px] items-center border-b px-4 py-3">
        <Skeleton className="size-4" />

        <Skeleton className="h-4 w-24" />

        <Skeleton className="h-4 w-16" />

        <Skeleton className="h-4 w-20" />

        <Skeleton className="h-4 w-16" />

        <Skeleton className="h-4 w-24" />

        <Skeleton className="h-4 w-16" />
      </div>

      {Array.from({ length: ROWS }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[48px_minmax(220px,1fr)_160px_180px_120px_160px_140px] items-center gap-0 border-b px-4 py-3 last:border-b-0"
        >
          <Skeleton className="size-4" />

          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />

            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>

          <Skeleton className="h-4 w-28" />

          <Skeleton className="h-4 w-24" />

          <Skeleton className="h-6 w-16 rounded-full" />

          <Skeleton className="h-4 w-24" />

          <div className="flex items-center gap-1">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      ))}
    </div>
  )
}
