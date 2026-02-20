"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order, User } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { EditOrderDialog } from "./edit-order-dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

type OrderWithUser = Order & {
    user: User
}

export const columns: ColumnDef<OrderWithUser>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row }) => {
            return <span className="text-center font-medium">{row.index + 1}</span>
        }
    },
    {
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 hover:bg-transparent"
                >
                    Order Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium text-left pl-4">{row.getValue("code")}</div>,
    },
    {
        accessorKey: "user.name",
        header: "Customer",
        cell: ({ row }) => <div className="capitalize">{row.original.user?.name || "Unknown"}</div>,
    },
    {
        accessorKey: "total",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 hover:bg-transparent"
                >
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "default"

            switch (status) {
                case "pending": variant = "secondary"; break;
                case "processing": variant = "outline"; break;
                case "shipped": variant = "default"; break;
                case "delivered": variant = "default"; break; // or success color if available
                case "cancelled": variant = "destructive"; break;
            }

            return <Badge variant={variant} className="capitalize">{status}</Badge>
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => <div className="text-muted-foreground">{format(new Date(row.getValue("createdAt")), "dd MMM yyyy HH:mm")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const order = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <EditOrderDialog order={order} />
                </div>
            )
        },
    },
]
