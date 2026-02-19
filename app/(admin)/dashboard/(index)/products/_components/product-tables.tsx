"use client";

import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { Product, Brand, Category, Location } from "@prisma/client";

type ProductWithRelations = Product & {
    brand: Brand;
    category: Category;
    location: Location;
}

interface ProductTablesProps {
    products: ProductWithRelations[];
    brands: Brand[];
    categories: Category[];
    locations: Location[];
}

export default function ProductTables({ products, brands, categories, locations }: ProductTablesProps) {
    const columns = getColumns({ brands, categories, locations });

    return (
        <DataTable columns={columns} data={products} />
    );
}
