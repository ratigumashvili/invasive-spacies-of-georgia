import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { SingleSpecieList } from "@/types/random-specie";
import { BASE_URL } from "@/lib/utils";

export function SpecieBlock({ data }: { data: SingleSpecieList }) {
    const t = useTranslations("Common")
    return (
        <Card className="rounded-none bg-slate-50 p-0 pb-6 flex-col h-full">
            <CardHeader className="p-0">
                <CardTitle className="text-xl sr-only">
                    {t("species_factsheets")}
                </CardTitle>
                {data?.image?.url ? (
                    <>
                        <Image
                            src={`${BASE_URL}${data?.image?.url}`}
                            alt="Species"
                            width={1000}
                            height={1000}
                            priority
                            className="w-full object-contain lg:max-h-[280px] lg:h-full lg:object-cover"
                        />
                        <span className="text-xs text-muted-foreground italic px-6">{data?.image?.caption}</span>
                    </>
                ) : <>
                    <Image
                        src={`/no-image.png`}
                        alt="Species"
                        width={100}
                        height={100}
                        priority
                        className="w-full object-contain h-full max-h-[200px] md:max-h-[260px] lg:max-h-[220px] lg:object-contain"
                    />
                    <span className="text-xs text-muted-foreground italic px-6">{t("no_image")}</span>
                </>}
            </CardHeader>
            <CardContent className="pb-6">
                <dl className="data-list">
                    <dt>{t("scientific_name")}:</dt>
                    <dd>
                        <Link href={`/species-list/${data?.slug}`}
                            className="italic font-medium text-sky-800 hover:text-sky-700 hover:underline"
                        >
                            {data?.name}
                        </Link>
                    </dd>
                    <dt>{t("nat")}:</dt>
                    <dd><p>{data?.autorName}</p></dd>
                    <dt>{t("eco_group")}:</dt>
                    <dd><p>{data?.ecologicalGroup}</p></dd>
                    {!data?.isNew ? (
                        <>
                            <dt>{t("first_introduced")}:</dt>
                            <dd><p>{data?.firstIntroduced}</p></dd>
                        </>
                    ) : (
                        <>
                            <dt>{t("date_detected")}:</dt>
                            <dd>
                                <p>
                                    {data?.dateOfDetection
                                        ? new Date(data.dateOfDetection).toLocaleDateString("en-CA") // "YYYY/MM/DD"
                                        : "N/A"}
                                </p>
                            </dd>
                        </>
                    )}

                </dl>
            </CardContent>
            <CardFooter className="mt-auto">
                <Button asChild size="lg" variant="default" className="w-full lg:w-max rounded-none">
                    <Link href={`/species-list/${data?.slug}`}>{t("details_on_specie")}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}