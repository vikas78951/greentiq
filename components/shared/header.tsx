
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {

    SidebarTrigger,
} from "@/components/ui/sidebar"


const Header = () => {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />

            <div>
                search bar
            </div>
        </header>
    )
}

export default Header