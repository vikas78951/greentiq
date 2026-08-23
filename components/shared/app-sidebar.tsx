import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Logo } from "./logo"
import NavMenu from "./nav-menu"

type IconName = "dashboard" | "customers"

type NavItem = {
  title: string
  url: string
  icon: IconName
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
          icon: "dashboard",
        },
        {
          title: "Customers",
          url: "/dashboard/customer",
          icon: "customers",
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
