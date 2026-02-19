"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product, Brand, Category, Location } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { deleteProduct } from "../lib/actions"
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

type ProductWithRelations = Product & {
    brand: Brand;
    category: Category;
    location: Location;
}

interface ColumnsProps {
    brands: Brand[];
    categories: Category[];
    locations: Location[];
}

// We need a function to create columns so we can pass data to EditDialog
export const getColumns = ({ brands, categories, locations }: ColumnsProps): ColumnDef<ProductWithRelations>[] => [
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
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const image = row.original.images[0]
            const name = row.getValue("name") as string

            return (
                <div className="flex items-center gap-3">
                    {(!image || image === "/images/placeholder.svg") ? (
                        <div
                            className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                            onClick={() => toast.error("Image not added yet")}
                        >
                            <span className="text-[10px] text-muted-foreground text-center p-1">No Image</span>
                        </div>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="relative h-12 w-12 overflow-hidden rounded-md border cursor-pointer hover:opacity-80 transition-opacity shrink-0">
                                    <Image src={image} alt={name} fill className="object-cover" />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{name}</DialogTitle>
                                </DialogHeader>
                                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                                    <Image src={image} alt={name} fill className="object-contain" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    <span className="capitalize font-medium">{name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 hover:bg-transparent"
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(price)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => <div className="capitalize">{row.getValue("stock")}</div>,
    },
    {
        accessorKey: "brand.name",
        header: "Brand",
        cell: ({ row }) => <div className="capitalize">{row.original.brand.name}</div>,
    },
    {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => <div className="capitalize">{row.original.category.name}</div>,
    },
    {
        accessorKey: "location.name",
        header: "Location",
        cell: ({ row }) => <div className="capitalize">{row.original.location.name}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <EditProductDialog
                        product={product}
                        brands={brands}
                        categories={categories}
                        locations={locations}
                    />
                    <DeleteDialog id={product.id} action={deleteProduct} itemName="Product" />
                </div>
            )
        },
    },
]
