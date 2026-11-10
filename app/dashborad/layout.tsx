import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DashboradSideBar } from './../components/DashboradSideBar';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboradSideBar/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout
