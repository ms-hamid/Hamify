import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getProducts, getBrandsForSelect, getCategoriesForSelect, getLocationsForSelect } from "./lib/data";
import { CreateProductDialog } from "./_components/create-product-dialog";
import ProductTables from "./_components/product-tables";

import { PageHeader } from "@/components/admin/page-header";

export default async function ProductsPage() {
    const products = await getProducts();
    const brands = await getBrandsForSelect();
    const categories = await getCategoriesForSelect();
    const locations = await getLocationsForSelect();

    return (
        <Card className="col-span-12">
            <CardHeader>
                <PageHeader
                    title="Products"
                    description="Manage your products here."
                    action={
                        <CreateProductDialog
                            brands={brands}
                            categories={categories}
                            locations={locations}
                        />
                    }
                />
            </CardHeader>
            <CardContent>
                <ProductTables
                    products={products}
                    brands={brands}
                    categories={categories}
                    locations={locations}
                />
            </CardContent>
        </Card>
    );
}
