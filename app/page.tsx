import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Frontend Assignment</p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Advanced CRM Dashboard
          </h1>

          <p className="text-muted-foreground">
            A production-style CRM dashboard for managing customers, search,
            sorting, filtering, customer CRUD, saved filters, and drag-and-drop
            ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={buttonVariants()}>
            Open Dashboard
          </Link>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          Next.js · TypeScript · Tailwind CSS · shadcn/ui
        </p>
      </div>
    </main>
  )
}
