"use client";

import { useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { createSpecie, uploadFile } from "@/lib/api-calls";

import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";

const specieSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    autorName: z.string().optional(),
    commonNames: z.string().optional(),
    habitat: z.string().min(3, "Habitat must be provided"),
    firstIntroduced: z.string().optional(),
    dateOfDetection: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    placeName: z.string().min(3, "place name must be at least 3 characters"),
    coordinates: z.string(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    comment: z.string().optional(),
    image: z.any().optional(),
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
            autorName: "",
            commonNames: "",
            habitat: "",
            firstIntroduced: "",
            dateOfDetection: "",
            placeName: "",
            coordinates: "",
            description: "",
            comment: "",
            image: undefined,
            submissionAuthor: ""
        }
    });

    useEffect(() => {
        if (user?.username) {
            form.setValue("submissionAuthor", `${user.username}, ${user.email}`, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [user?.username, form]);

    const handleSubmit = async (values: any) => {
        try {
            let uploadedFile = null;

            if (values.image) {
                uploadedFile = await uploadFile(token, values.image);
                if (!uploadedFile?.id) {
                    throw new Error("File upload failed.");
                }
            }

            const specieData = {
                name: values.name,
                autorName: values.autorName,
                commonNames: values.commonNames,
                habitat: values.habitat,
                firstIntroduced: values.firstIntroduced,
                dateOfDetection: values.dateOfDetection,
                placeName: values.placeName,
                coordinates: values.coordinates,
                description: [
                    {
                        type: "paragraph",
                        children: [{ type: "text", text: values.description }]
                    }
                ],
                comment: [
                    {
                        type: "paragraph",
                        children: [{ type: "text", text: values.description }]
                    }
                ],
                submissionAuthor: values.submissionAuthor,
                image: uploadedFile?.id || null
            };

            const response = await createSpecie(token, specieData, uploadedFile?.id);

            if (response.status === "success") {
                toast.success("Record created successfully! It is already sent for review");
                form.reset();
            } else {
                toast.error(`Error: ${response.message || "Unknown error"}`);
            }
        } catch (error: any) {
            toast.error(`Submission failed: ${error.message}`);
        }
    };


    return (
        <div className="w-full">

            <h2 className="text-2xl font-medium mb-6">Submit Specie</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter Latin name" className="rounded-none px-3 py-6 text-base placeholder:text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="autorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name according to</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Scientific name authorship" className="rounded-none px-3 py-6 text-base placeholder:text-base" />
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
                                        <Input {...field} placeholder="Scientific name authorship" className="rounded-none px-3 py-6 text-base placeholder:text-base" />
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
                                        <Input {...field} placeholder="Enter habitat type" className="rounded-none px-3 py-6 text-base placeholder:text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <FormField
                            control={form.control}
                            name="firstIntroduced"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Introduced</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            {...field}
                                            placeholder="First introduced in Georgia"
                                            className="rounded-none px-3 py-6 text-base placeholder:text-base"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
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
                                                        "border justify-start text-left font-normal rounded-none px-3 py-6 text-base",
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
                            name="placeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Place name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter location name" className="rounded-none px-3 py-6 text-base placeholder:text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="coordinates"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coordinates</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="eg: 41.72978190316588, 44.738779670182474" className="rounded-none px-3 py-6 text-base placeholder:text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="flex flex-row items-start w-full">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} {...field} placeholder="Enter specie description" className="rounded-none p-3 text-base placeholder:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-row items-start w-full">
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} {...field} placeholder="Enter additional comment" className="rounded-none p-3 text-base placeholder:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { onChange, ref } }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl className="px-3 h-[50px]">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        ref={ref}
                                        onChange={(e) => onChange(e.target.files?.[0])}
                                        className="rounded-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 mt-4">
                        <Button type="button" variant="destructive" className="w-full sm:w-max rounded-none cursor-pointer py-6" asChild>
                            <Link href={"/"}>Cancel</Link>
                        </Button>
                        <Button type="submit" className="w-full sm:w-max rounded-none  cursor-pointer py-6">Create Specie</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
