"use client";

import { useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { createSpecie } from "@/lib/api-calls";

import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const specieSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    authorName: z.string().optional(),
    commonNames: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    habitat: z.string().min(3, "Habitat must be provided"),
    dateOfDetection: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    submissionAuthor: z.string()
});

export function CreateSpecieForm() {
    const { user, token } = useAuth();

    if (!user || !token) {
        return <p className="text-red-500">You must be logged in to create a specie.</p>;
    }

    const form = useForm({
        resolver: zodResolver(specieSchema),
        defaultValues: {
            name: "",
            authorName: "",
            commonNames: "",
            description: "",
            habitat: "",
            dateOfDetection: "",
            submissionAuthor: ""
        }
    });

    const handleSubmit = async (values: any) => {
        const specieData = {
            name: values.name,
            authorName: values.authorName,
            commonNames: values.commonNames,
            description: [
                {
                    type: "paragraph",
                    children: [
                        { type: "text", text: values.description }
                    ]
                }
            ],
            habitat: values.habitat,
            dateOfDetection: values.dateOfDetection,
            submissionAuthor: values.submissionAuthor
        };

        const response = await createSpecie(token, specieData);

        if (response.status === "success") {
            toast.success("Record created successfully! It is already sent for review.");
            form.reset();
        } else {
            toast.error(`Error: ${response.message}`);
        }
    };

    useEffect(() => {
        if (user?.username) {
            form.setValue("submissionAuthor", `${user.username}, ${user.email}`, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [user?.username, form]);


    return (
        <div className="w-full max-w-[500px]">
            <h2 className="text-2xl font-bold mb-6">Create a New Specie</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">

                    <FormField
                        control={form.control}
                        name="submissionAuthor"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="hidden" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scientific Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter specie name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="authorName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name according to</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Scientific name authorship" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="commonNames"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Common names</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Scientific name authorship" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dateOfDetection"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of detection</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"ghost"}
                                                className={cn(
                                                    "border justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const formatted = format(date, "yyyy-MM-dd");
                                                        field.onChange(formatted);
                                                    }
                                                }}
                                                disabled={{ after: new Date() }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
