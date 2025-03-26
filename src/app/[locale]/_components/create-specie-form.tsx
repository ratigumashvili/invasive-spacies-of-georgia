"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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


export function CreateSpecieForm() {
    const { user, token } = useAuth();

    const t = useTranslations("Dashboard")

    const specieSchema = z.object({
        name: z.string().min(3, t("name_error")),
        autorName: z.string().optional(),
        commonNames: z.string().optional(),
        // habitat: z.string().optional(),
        firstRecorded: z.string().optional(),
        dateOfDetection: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t("date_error")),
        placeName: z.string().min(2, t("place_error")),
        coordinates: z.string(),
        // description: z.string().optional(),
        // comment: z.string().optional(),
        image: z.any().optional(),
        submissionAuthor: z.string()
    });

    const form = useForm({
        resolver: zodResolver(specieSchema),
        defaultValues: {
            name: "",
            autorName: "",
            commonNames: "",
            // habitat: "",
            firstRecorded: "",
            dateOfDetection: "",
            placeName: "",
            coordinates: "",
            // description: "",
            // comment: "",
            image: undefined,
            submissionAuthor: ""
        }
    });

    useEffect(() => {
        if (user?.username) {
            form.setValue("submissionAuthor", `${user.username}`, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [user?.username, form]);

    const handleSubmit = async (values: any) => {
        try {
            let uploadedFile = null;

            if (values.image) {
                uploadedFile = await uploadFile(token as string, values.image);
                if (!uploadedFile?.id) {
                    throw new Error("File upload failed.");
                }
            }

            const specieData = {
                name: values.name,
                autorName: values.autorName,
                commonNames: values.commonNames,
                // habitat: values.habitat,
                firstRecorded: values.firstRecorded,
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

            const response = await createSpecie(token as string, specieData, uploadedFile?.id);

            if (response.status === "success") {
                toast.success(t("success_message"));
                form.reset();
            } else {
                toast.error(`Error: ${response.message || "Unknown error"}`);
            }
        } catch (error: any) {
            toast.error(`Submission failed: ${error.message}`);
        }
    };

    if (!user || !token) {
        return <p className="text-red-500">{t("login_error")}.</p>;
    }

    return (
        <div className="w-full">

            <h2 className="text-2xl font-medium mb-6">{t("submit_specie")}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("name_placeholder")} className="rounded-none px-3 py-6 text-base" />
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
                                    <FormLabel>{t("nat")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("nat_placeholder")} className="rounded-none px-3 py-6 text-base" />
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
                                    <FormLabel>{t("common_names")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("common_names_placeholder")} className="rounded-none px-3 py-6 text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="habitat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("habitat")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("habitat_placeholder")} className="rounded-none px-3 py-6 text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <FormField
                            control={form.control}
                            name="firstRecorded"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("introduced")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            {...field}
                                            placeholder={t("introduced_placeholder")}
                                            className="rounded-none px-3 py-6 text-base"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 4) {
                                                    field.onChange(value);
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
                                    <FormLabel>{t("date_of_detection")}</FormLabel>
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
                                                    {field.value ? format(new Date(field.value), "PPP") : <span className="text-sm">{t("pic_date")}</span>}
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
                                    <FormLabel>{t("place_name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("placename_placeholder")} className="rounded-none px-3 py-6 text-base" />
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
                                    <FormLabel>{t("coordinates")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("coord_placeholder")} className="rounded-none px-3 py-6 text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="flex flex-row items-start w-full">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("description")}</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} {...field} placeholder={t("description_placehodler")} className="rounded-none p-3 text-base" />
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
                                        <FormLabel>{t("comment")}</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} {...field} placeholder={t("comment_placeholder")} className="rounded-none p-3 text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div> */}

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { onChange, ref } }) => (
                            <FormItem>
                                <FormLabel>{t("image")}</FormLabel>
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
                        <Button type="button" variant="destructive" className="w-full sm:w-max rounded-none cursor-pointer py-5 px-7" asChild>
                            <Link href={"/"}>{t("cancel")}</Link>
                        </Button>
                        <Button type="submit" className="w-full sm:w-max rounded-none  cursor-pointer py-5 px-7">{t("submit")}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
