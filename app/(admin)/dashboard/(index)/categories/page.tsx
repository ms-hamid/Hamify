import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getCategories } from "./lib/data";
import { CreateCategoryDialog } from "./_components/create-category-dialog";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                <CreateCategoryDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Category List</CardTitle>
                    <CardDescription>
                        Manage your product categories here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
