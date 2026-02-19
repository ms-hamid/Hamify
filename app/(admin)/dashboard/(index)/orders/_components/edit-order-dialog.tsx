"use client";

import { updateOrderStatus } from "../lib/actions";
import { orderStatusSchema, TOrderStatus } from "../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState, useEffect } from "react";
import { Loader2, Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Order } from "@prisma/client";

interface EditOrderDialogProps {
    order: Order;
}

export function EditOrderDialog({ order }: EditOrderDialogProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<TOrderStatus>({
        resolver: zodResolver(orderStatusSchema),
        defaultValues: {
            status: order.status as any,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                status: order.status as any,
            });
            setError(null);
        }
    }, [order, open, form]);

    function onSubmit(values: TOrderStatus) {
        setError(null);
        startTransition(async () => {
            const result = await updateOrderStatus(order.id, values);
            if (result?.error) {
                setError(result.error);
            } else {
                setOpen(false);
                toast.success("Order status updated successfully");
            }
        });
    }

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
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogDescription>
                        Change the status of the order.
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Updating..." : "Update Status"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
