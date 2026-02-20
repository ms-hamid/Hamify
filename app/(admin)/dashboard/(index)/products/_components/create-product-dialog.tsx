"use client";

import { createProduct } from "../lib/actions";
import { productSchema, TProduct } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { Loader2, Plus, AlertCircle, X } from "lucide-react";
import Image from "next/image";
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
import { Brand, Category, Location } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface CreateProductDialogProps {
    brands: Brand[];
    categories: Category[];
    locations: Location[];
}

export function CreateProductDialog({ brands, categories, locations }: CreateProductDialogProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<TProduct>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: "ready",
            brandId: 0,
            categoryId: 0,
            locationId: 0,
            images: [],
        },
    });

    async function onSubmit(values: TProduct) {
        setError(null);
        startTransition(async () => {
            try {
                const result = await createProduct(values);

                if (result?.error) {
                    setError(result.error);
                } else {
                    setOpen(false);
                    form.reset();
                    toast.success("Product created successfully");
                }
            } catch (err: any) {
                // Next.js might throw "Body exceeded 1MB limit" or similar
                if (err.message?.includes("Body exceeded") || err.message?.includes("Payload")) {
                    setError("Total file size too large. Maximum allowed is 30MB.");
                } else {
                    setError(err instanceof Error ? err.message : "An unexpected error occurred");
                }
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Create a new product with details and relations.
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
                                        <Select onValueChange={(value) => field.onChange(Number(value))} disabled={isPending}>
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
                                        <Select onValueChange={(value) => field.onChange(Number(value))} disabled={isPending}>
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
                                        <Select onValueChange={(value) => field.onChange(Number(value))} disabled={isPending}>
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
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Product Images (Max 4)</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {/* Image Previews */}
                                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                    {Array.isArray(value) && value.map((file: File, index: number) => (
                                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                                            <Image
                                                                src={URL.createObjectURL(file)}
                                                                alt={`Preview ${index}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newFiles = [...value];
                                                                    newFiles.splice(index, 1);
                                                                    onChange(newFiles);
                                                                }}
                                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* File Input */}
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        {...fieldProps}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        disabled={isPending}
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            const currentFiles = Array.isArray(value) ? value : [];

                                                            if (currentFiles.length + files.length > 4) {
                                                                toast.error("Maximum 4 images allowed");
                                                                return;
                                                            }

                                                            onChange([...currentFiles, ...files]);
                                                            // Reset input value to allow selecting same file again if needed
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    You can upload up to 4 images.
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
                                {isPending ? "Creating..." : "Create Product"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
