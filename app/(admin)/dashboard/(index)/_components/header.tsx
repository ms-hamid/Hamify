"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter((item) => item !== "" && item !== "dashboard")

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/dashboard">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {segments.length === 0 ? (
                            <>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Overview</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        ) : (
                            segments.map((segment, index) => {
                                const isLast = index === segments.length - 1
                                const href = `/dashboard/${segments.slice(0, index + 1).join("/")}`
                                const title = segment.charAt(0).toUpperCase() + segment.slice(1)

                                return (
                                    <React.Fragment key={segment}>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem className="hidden md:block">
                                            {isLast ? (
                                                <BreadcrumbPage>{title}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={href}>
                                                    {title}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                )
                            })
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="ml-auto px-4 flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    />
                </div>
                <ModeToggle />
            </div>
        </header>
    )
}
