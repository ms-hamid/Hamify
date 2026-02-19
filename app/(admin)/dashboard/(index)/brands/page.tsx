import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { getBrands } from "./lib/data";
import { CreateBrandDialog } from "./_components/create-brand-dialog";
import { PageHeader } from "@/components/admin/page-header";

export default async function BrandsPage() {
    const brands = await getBrands();

    return (
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
            </div>
            <Card className="col-span-12">
                <CardHeader>
                    <PageHeader
                        title="Brands"
                        description="Manage your product brands here."
                        action={<CreateBrandDialog />}
                    />
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={brands} />
                </CardContent>
            </Card>
        </div>
    );
}
