import { AppSidebar } from "@/components/shared/app-sidebar"
import Header from "@/components/shared/header"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="min-h-svh"><SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      {children}
    </SidebarInset>
  </SidebarProvider>

  </main>
}
