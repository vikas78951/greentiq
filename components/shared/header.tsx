import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./theme-switcher"

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      <ModeToggle />
    </header>
  )
}

export default Header
