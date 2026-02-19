import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { getOrders } from "./lib/data";
import { PageHeader } from "@/components/admin/page-header";

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <Card className="col-span-12">
            <CardHeader>
                <PageHeader
                    title="Orders"
                    description="Manage customer orders here."
                />
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={orders} />
            </CardContent>
        </Card>
    );
}
