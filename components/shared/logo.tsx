
import * as React from "react"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon } from "lucide-react"

export function Logo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GalleryVerticalEndIcon className="size-4" />
        </div>
        <div className="flex items-center gap-0.5 leading-none">
          <span className="text-2xl font-medium">Greentiq</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
