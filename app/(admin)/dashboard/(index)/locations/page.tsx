import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { getLocations } from "./lib/data";
import { CreateLocationDialog } from "./_components/create-location-dialog";
import { PageHeader } from "@/components/admin/page-header";

export default async function LocationsPage() {
    const locations = await getLocations();

    return (
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
            </div>
            <Card className="col-span-12">
                <CardHeader>
                    <PageHeader
                        title="Locations"
                        description="Manage your product locations here."
                        action={<CreateLocationDialog />}
                    />
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={locations} />
                </CardContent>
            </Card>
        </div>
    );
}
