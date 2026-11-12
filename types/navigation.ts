import type { LucideIcon } from "lucide-react"

// Sidebar navigation entries (used by DashboradSideBar's menuItemsByRole)
export type MenuItem = {
  /** Display label shown in the sidebar */
  name: string
  /** Destination route of the menu item */
  url: string
  /** Icon component rendered before the label */
  icon: LucideIcon
}
