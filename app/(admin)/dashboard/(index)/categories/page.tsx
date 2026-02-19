import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { getCategories } from "./lib/data";
import { CreateCategoryDialog } from "./_components/create-category-dialog";
import { PageHeader } from "@/components/admin/page-header";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            </div>

            <Card className="col-span-12">
                <CardHeader>
                    <PageHeader
                        title="Categories"
                        description="Manage your product categories here."
                        action={<CreateCategoryDialog />}
                    />
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
