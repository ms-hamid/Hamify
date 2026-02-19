"use client";

import { updateProduct } from "../lib/actions";
import { productSchema, TProduct } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState, useEffect } from "react";
import { Loader2, Edit, AlertCircle, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brand, Category, Location, Product } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface EditProductDialogProps {
    product: Product;
    brands: Brand[];
    categories: Category[];
    locations: Location[];
}

export function EditProductDialog({ product, brands, categories, locations }: EditProductDialogProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<TProduct>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: product.name,
            description: product.description,
            price: Number(product.price),
            stock: product.stock as any, // Cast to match schema enum
            brandId: product.brandId,
            categoryId: product.categoryId,
            locationId: product.locationId,
            images: product.images[0] || "",
        },
    });

    // Fix: Reset form when product prop changes
    useEffect(() => {
        if (open) {
            form.reset({
                name: product.name,
                description: product.description,
                price: Number(product.price),
                stock: product.stock as any,
                brandId: product.brandId,
                categoryId: product.categoryId,
                locationId: product.locationId,
                images: product.images[0] || "",
            });
            setError(null);
        }
    }, [product, open, form]);

    async function onSubmit(values: TProduct) {
        setError(null);

        startTransition(async () => {
            let imageUrl = values.images; // Default to existing

            if (values.images && values.images instanceof File) {
                const formData = new FormData();
                formData.append("file", values.images);
                const uploadRes = await uploadFile(formData);

                if (uploadRes.error) {
                    setError(uploadRes.error);
                    return;
                }
                imageUrl = uploadRes.url as string;
            }

            // Ensure values are numbers where expected by the schema/action
            // The form handles coercing, but explicit checking is good
            const result = await updateProduct(product.id, {
                ...values,
                images: imageUrl as string
            });

            if (result?.error) {
                setError(result.error);
            } else {
                setOpen(false);
                toast.success("Product updated successfully");
            }
        });
    }

    const currentImage = form.watch("images");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-blue-600 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                    <span className="sr-only">Edit</span>
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Update the product details.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Headphones" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Product description..." disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="10000" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select stock status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ready">Ready Stock</SelectItem>
                                                <SelectItem value="preorder">Pre-order</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Brand" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id.toString()}>{brand.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="locationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem key={location.id} value={location.id.toString()}>{location.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Product Image (Optional)</FormLabel>
                                        <FormControl>
                                            <div className="space-y-3">
                                                {/* Image Preview & Remove Button */}
                                                {currentImage && typeof currentImage === 'string' && currentImage.length > 0 ? (
                                                    <div className="relative w-full h-[200px] rounded-lg border overflow-hidden bg-slate-50">
                                                        <Image
                                                            src={currentImage}
                                                            alt="Product Image"
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-6 w-6"
                                                            onClick={() => form.setValue("images", "")}
                                                        >
                                                            <X className="h-3 w-3" />
                                                            <span className="sr-only">Remove image</span>
                                                        </Button>
                                                    </div>
                                                ) : null}

                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        disabled={isPending}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                            }
                                                        }}
                                                        {...field}
                                                    />
                                                    {currentImage instanceof File && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => form.setValue("images", "")}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Select a new file to replace the current image, or remove it.
                                                </p>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
