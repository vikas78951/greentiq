import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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

type NavMenuProps = {
  data: {
    navMain: NavGroup[]
  }
}

export default function NavMenu({ data }: NavMenuProps) {
  return (
    <>
      {data.navMain.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive}>
                      <Link href={item.url} className="flex items-center gap-2">
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
