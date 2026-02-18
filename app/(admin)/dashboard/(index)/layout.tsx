import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/sidebar"
import { Header } from "./_components/header"
import { getCurrentSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { session, user } = await getCurrentSession()

    if (!session || !user) {
        redirect("/dashboard/sign-in")
    }

    if (user.role !== "superadmin") {
        redirect("/")
    }

    return (
        <SidebarProvider>
            <AdminSidebar user={user} />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}