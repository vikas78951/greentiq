import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Logo } from "./logo"
import NavMenu from "./nav-menu"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  navMain: NavGroup[]
}

const data: SidebarData = {
  navMain: [
    {
      title: "MENU",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "Customers",
          url: "/dashboard/customer",
          icon: Users,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="pt-4">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <NavMenu data={data} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
