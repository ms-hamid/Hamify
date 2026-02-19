"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Brand } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { EditBrandDialog } from "./edit-brand-dialog"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { deleteBrand } from "../lib/actions"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export const columns: ColumnDef<Brand>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row }) => {
            return <span className="text-center font-medium">{row.index + 1}</span>
        }
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => {
            const logo = row.getValue("logo") as string;
            const name = row.getValue("name") as string;

            if (!logo || logo === "/images/placeholder.svg") {
                return (
                    <div
                        className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => toast.error("Image not added yet")}
                    >
                        <span className="text-[10px] text-muted-foreground text-center p-1">No Image</span>
                    </div>
                )
            }

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border cursor-pointer hover:opacity-80 transition-opacity">
                            <Image src={logo} alt={name} fill className="object-cover" />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{name}</DialogTitle>
                        </DialogHeader>
                        <div className="relative aspect-square w-full overflow-hidden rounded-md">
                            <Image src={logo} alt={name} fill className="object-contain" />
                        </div>
                    </DialogContent>
                </Dialog>
            )
        },
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
                    Brand Name
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
            const brand = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <EditBrandDialog brand={brand} />
                    <DeleteDialog id={brand.id} action={deleteBrand} itemName="Brand" />
                </div>
            )
        },
    },
]
