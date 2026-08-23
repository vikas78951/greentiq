import { Users, UserCheck, UserX, Building2 } from "lucide-react"

import { customers } from "@/features/customers/data/customers"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Page() {
  const totalCustomers = customers.length

  const activeCustomers = customers.filter(
    (customer) => customer.status === "active"
  ).length

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "inactive"
  ).length

  const totalCompanies = new Set(customers.map((customer) => customer.company))
    .size

  const activePercentage =
    totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * 100)
      : 0

  const inactivePercentage =
    totalCustomers > 0
      ? Math.round((inactiveCustomers / totalCustomers) * 100)
      : 0

  const recentCustomers = [...customers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "All customers",
      icon: Users,
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      description: `${activePercentage}% of total customers`,
      icon: UserCheck,
    },
    {
      title: "Inactive Customers",
      value: inactiveCustomers,
      description: `${inactivePercentage}% of total customers`,
      icon: UserX,
    },
    {
      title: "Companies",
      value: totalCompanies,
      description: "Unique companies",
      icon: Building2,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="text-sm text-muted-foreground">
          Overview of your customer data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>

                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Overview</CardTitle>

            <CardDescription>
              Current customer status distribution.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active</span>

                <span className="font-medium">{activeCustomers}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${activePercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Inactive</span>

                <span className="font-medium">{inactiveCustomers}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-muted-foreground"
                  style={{
                    width: `${inactivePercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">
                Total customers
              </span>

              <span className="font-semibold">{totalCustomers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>

            <CardDescription>
              Recently created customer records.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {customer.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {customer.company}
                    </p>
                  </div>

                  <Badge
                    variant={
                      customer.status === "active" ? "default" : "secondary"
                    }
                  >
                    {customer.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
