"use client"

import {
  BookmarkIcon,
  Building2Icon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,

  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

type Role = "seeker" | "recruiter" | "admin"

type MenuItem = {
  /** Display label shown in the sidebar */
  name: string
  /** Destination route of the menu item */
  url: string
  /** Icon component rendered before the label */
  icon: LucideIcon
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Overview", url: "/dashboard/seeker", icon: LayoutDashboardIcon },
    { name: "Browse Jobs", url: "/dashboard/seeker/jobs", icon: SearchIcon },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: BookmarkIcon },
    { name: "My Applications", url: "/dashboard/seeker/applications", icon: FileTextIcon },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: CreditCardIcon },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: SettingsIcon },
  ],
  recruiter: [
    { name: "Overview", url: "/dashboard/recruiter", icon: LayoutDashboardIcon },
    { name: "My Company", url: "/dashboard/recruiter/company", icon: Building2Icon },
    { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: ClipboardListIcon },
    { name: "Post a Job", url: "/dashboard/recruiter/jobs/new", icon: PlusIcon },
    // Applicants live on a dynamic route per job: /dashboard/jobs/:jobId/applicants
    // This item points at the listing below the jobs page for now
    { name: "View Applicants", url: "/dashboard/recruiter/applicants", icon: UsersIcon },
    { name: "Billing", url: "/dashboard/recruiter/billing", icon: CreditCardIcon },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: SettingsIcon },
  ],
  admin: [
    { name: "Overview", url: "/dashboard/admin", icon: LayoutDashboardIcon },
    { name: "Manage Users", url: "/dashboard/admin/users", icon: UsersIcon },
    { name: "Manage Companies", url: "/dashboard/admin/companies", icon: Building2Icon },
    { name: "Manage Jobs", url: "/dashboard/admin/jobs", icon: ClipboardListIcon },
    { name: "Payments", url: "/dashboard/admin/payments", icon: WalletIcon },
    { name: "Settings", url: "/dashboard/admin/settings", icon: SettingsIcon },
  ],
}

export function DashboradSideBar() {
  const { data: session } = useSession()
  // session.user.role comes from the better-auth "role" additional field;
  // falls back to seeker while session is loading or for guests
  const role = (session?.user?.role as Role | undefined) ?? "seeker"
  const items = menuItemsByRole[role]

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
