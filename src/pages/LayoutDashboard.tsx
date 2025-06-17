import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getUser, getUserRole } from "@/lib/network/authServices";
import { Outlet } from "react-router-dom";

export default function LayoutDashboard() {
  const user = getUser();
  const role = getUserRole();
  console.log(user);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <main className="w-full">
        <SidebarInset>
          <Navbar user={user} />
          <div className="py-4 w-11/12 md:w-8/10 mt-6 m-auto">
            <Outlet />
          </div>
          <Toaster />
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
