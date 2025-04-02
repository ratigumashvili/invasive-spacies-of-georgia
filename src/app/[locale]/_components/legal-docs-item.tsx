

import { Link } from "@/i18n/routing";

import { formatDate } from "@/lib/utils";
import { LegalDocs } from "@/types/legal-docs-response";
import { useTranslations } from "next-intl";

export function LegalDocsItem({ document }: { document: LegalDocs }) {
    const t = useTranslations("LegalDocs")
    return (
        <div key={document.id} className="mb-8 flex flex-col gap-y-2">
            <h2 className="text-lg font-medium">{document.title}</h2>
            <p><span className="text-muted-foreground">{t("date_published")}</span>: {formatDate(document.date.day, document.date.month, document.date.year,)}</p>
            <p><span className="text-muted-foreground">{t("type")}</span>: {document.documentType}</p>
            <p><span className="text-muted-foreground">{t("description")}</span>: {document.description}</p>
            <Link href={document.url} target="blank" className="text-sky-800 font-medium">{t("view")}</Link>
        </div>
    )
}