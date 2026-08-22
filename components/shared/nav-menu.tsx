"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const icons = {
  dashboard: LayoutDashboard,
  customers: Users,
}

type IconName = keyof typeof icons

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

type NavMenuProps = {
  data: {
    navMain: NavGroup[]
  }
}

export default function NavMenu({ data }: NavMenuProps) {
  const pathname = usePathname()

  return (
    <>
      {data.navMain.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>
            {group.title}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = icons[item.icon]

                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                       
                      isActive={isActive}
                      
                    >
                      <Link href={item.url} className="flex gap-2 items-center w-full">
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}