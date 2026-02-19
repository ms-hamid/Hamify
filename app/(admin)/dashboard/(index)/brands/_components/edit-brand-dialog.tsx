"use client";

import { updateBrand } from "../lib/actions";
import { brandSchema, TBrand } from "../lib/schema";
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
    FormControl, // Added for correct import
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brand } from "@prisma/client";
import Image from "next/image";

interface EditBrandDialogProps {
    brand: Brand;
}

export function EditBrandDialog({ brand }: EditBrandDialogProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<TBrand>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: brand.name,
            logo: brand.logo,
        },
    });

    // Fix: Reset form when brand prop changes
    useEffect(() => {
        if (open) {
            form.reset({
                name: brand.name,
                logo: brand.logo,
            });
            setError(null);
        }
    }, [brand, open, form]);

    async function onSubmit(values: TBrand) {
        setError(null);
        startTransition(async () => {
            let logoUrl = values.logo; // Default to existing value (string/URL)

            // Check if logo is a File object (uploaded)
            if (values.logo && values.logo instanceof File) {
                const formData = new FormData();
                formData.append("file", values.logo);
                const uploadRes = await uploadFile(formData);

                if (uploadRes.error) {
                    setError(uploadRes.error);
                    return;
                }
                logoUrl = uploadRes.url as string;
            }

            const result = await updateBrand(brand.id, {
                ...values,
                logo: logoUrl as string
            });

            if (result?.error) {
                setError(result.error);
            } else {
                setOpen(false);
                toast.success("Brand updated successfully");
            }
        });
    }

    const currentLogo = form.watch("logo");

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                    <DialogDescription>
                        Update the brand details. Click save when you're done.
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
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Nike" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Brand Logo (Optional)</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            {/* Image Preview & Remove Button */}
                                            {currentLogo && typeof currentLogo === 'string' && currentLogo.length > 0 ? (
                                                <div className="relative w-full h-[120px] rounded-lg border overflow-hidden bg-slate-50">
                                                    <Image
                                                        src={currentLogo}
                                                        alt="Brand Logo"
                                                        fill
                                                        className="object-contain p-2"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-6 w-6"
                                                        onClick={() => form.setValue("logo", "")}
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
                                                {currentLogo instanceof File && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => form.setValue("logo", "")}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Select a new file to replace the current logo, or remove it.
                                            </p>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
