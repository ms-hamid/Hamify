"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Category } from "@prisma/client"
import { MoreHorizontal, Router, Trash, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Category>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row }) => {
            return <span className="text-center font-medium">{row.index + 1}</span>
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 hover:bg-transparent"
                >
                    Category Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-left pl-4 capitalize">{row.getValue("name")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-blue-600 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => console.log("Edit", category.id)} // Placeholder for Edit action
                    >
                        <span className="sr-only">Edit</span>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-red-600 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => console.log("Delete", category.id)} // Placeholder for Delete action
                    >
                        <span className="sr-only">Delete</span>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]
