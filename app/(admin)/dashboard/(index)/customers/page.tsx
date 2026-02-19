import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { getCustomers } from "./lib/data";
import { PageHeader } from "@/components/admin/page-header";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <Card className="col-span-12">
            <CardHeader>
                <PageHeader
                    title="Customers"
                    description="Manage your customer base here."
                />
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={customers} />
            </CardContent>
        </Card>
    );
}
