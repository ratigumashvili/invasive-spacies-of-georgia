import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

import { Species } from "@/types/specie-response"

export function SpeciesTable({ data }: { data: any }) {
    const t = useTranslations("Species")
    return (
        <div className="w-full overflow-x-auto">
            {data?.length !== 0 && (
                <table className="w-full min-w-7xl">
                    <thead>
                        <tr>
                            <th className="text-nowrap">{t("scientific_name")}</th>
                            <th className="text-nowrap">{t("nat")}</th>
                            <th className="text-nowrap">{t("eco_group")}</th>
                            <th>{t("family")}</th>
                            <th>{t("genus")}</th>
                            <th className="text-nowrap">{t("first_introduced")}</th>
                            <th className="text-nowrap">{t("detected")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item: Species) => (
                            <tr key={item.documentId}>
                                <td>
                                    <Link href={`/species-list/${item.slug}`} className="text-sky-800 font-medium hover:underline">{item.name}</Link>
                                </td>
                                <td>{item.autorName}</td>
                                <td>{item.ecologicalGroup}</td>
                                <td>{item.family?.name}</td>
                                <td>{item.genus?.name}</td>
                                <td>{item.firstIntroduced}</td>
                                <td>{item.dateOfDetection}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}