"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Category } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { Button } from "@/components/ui/button"

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
                    <EditCategoryDialog category={category} />
                    <DeleteCategoryDialog id={category.id} />
                </div>
            )
        },
    },
]
