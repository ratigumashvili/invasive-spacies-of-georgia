"use client";

import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createSpecie } from "@/lib/api-calls";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const specieSchema = z.object({
    title: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    habitat: z.string().min(3, "Habitat must be provided"),
});

export function CreateSpecieForm() {
    const { user, token } = useAuth();

    if (!user || !token) {
        return <p className="text-red-500">You must be logged in to create a specie.</p>;
    }

    const form = useForm({
        resolver: zodResolver(specieSchema),
        defaultValues: { title: "", description: "", habitat: "" },
    });

    const handleSubmit = async (values: any) => {
        const specieData = {
            title: values.title,
            description: [
                {
                    type: "paragraph",
                    children: [
                        { type: "text", text: values.description }
                    ]
                }
            ],
            habitat: values.habitat,
        };
    
        const response = await createSpecie(token, specieData);
    
        if (response.status === "success") {
            toast.success("Record created successfully! It is already sent to review.");
            form.reset();
        } else {
            toast.error(`Error: ${response.message}`);
        }
    };
    
    return (
        <div className="w-full max-w-[500px]">
            <h2 className="text-2xl font-bold mb-6">Create a New Specie</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter specie name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter specie description" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="habitat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Habitat</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter habitat type" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="mt-4">Create Specie</Button>
                </form>
            </Form>
        </div>
    );
}
