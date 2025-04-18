import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { SingleSpecieList } from "@/types/random-specie";
import { BASE_URL, formatDate, getOldestDetectionDate } from "@/lib/utils";

export function SpecieBlock({ data, isHome }: { data: SingleSpecieList, isHome?: boolean }) {
    const t = useTranslations("Common")
    const s = useTranslations("Species")

    function detectLifeForm(value: string) {
        switch (value) {
            case "aquatic":
                return s("aquatic")
            case "semiaquatic":
                return s("semiaquatic")
            case "terrestrial":
                return s("terrestrial")
            default:
                return "Unknown";
        }
    }

    return (
        <Card className="rounded-md shadow-none overflow-hidden p-0 pb-6 flex-col h-full">
            <CardHeader className="p-0 flex">
                <CardTitle className="text-xl sr-only">
                    {t("species_factsheets")}
                </CardTitle>
                {data.image && data?.image.length ? (
                    <>
                        <Image
                            src={`${BASE_URL}${data?.image[0]?.url}`}
                            alt="Species"
                            width={1000}
                            height={1000}
                            priority
                            className="w-full object-contain lg:max-h-[180px] lg:h-full lg:object-cover"
                        />
                        <span className="text-xs text-muted-foreground italic px-6">{data?.image[0]?.caption}</span>
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
                {!isHome ? (
                    <dl className="data-list">
                        <dt>{t("scientific_name")}:</dt>
                        <dd>
                            <Link href={`/species-list/${data?.slug}`}
                                className="italic font-medium link text-lg"
                            >
                                {data?.name}
                            </Link>
                        </dd>
                        <dt>{t("nat")}:</dt>
                        <dd><p>{data?.autorName}</p></dd>
                        <dt>{t("eco_group")}:</dt>
                        <dd>{detectLifeForm(data?.lifeForm as string)}</dd>
                        {(data.detectionDate?.length ?? 0) > 0 && (() => {
                            const oldest = getOldestDetectionDate(data.detectionDate!);
                            return (
                                <>
                                    <dt>{t("first_introduced")}:</dt>
                                    <dd>{formatDate(oldest?.day, oldest?.month, oldest?.year)}</dd>
                                </>
                            );
                        })()}
                    </dl>
                ) : (
                    <>
                        <Link href={`/species-list/${data?.slug}`}
                            className="italic font-medium link text-lg"
                        >
                            {data?.name}
                        </Link>
                    </>
                )}
            </CardContent>
            <CardFooter className="mt-auto">
                <Button asChild size="lg" variant="blue" className="w-full lg:w-max">
                    <Link href={`/species-list/${data?.slug}`}>{t("details_on_specie")}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}