

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDate } from "@/lib/utils";
import { LegalDocs } from "@/types/legal-docs-response";

export function LegalDocsItem({ document }: { document: LegalDocs }) {
    const t = useTranslations("LegalDocs")
    return (
        <Card key={document.id} className="mb-8 shadow-none">
            <CardHeader>
                <CardTitle>
                    <h2 className="text-lg font-medium">{document.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2">
                <p><span className="text-muted-foreground">{t("date_published")}</span>: {formatDate(document.date.day, document.date.month, document.date.year,)}</p>
                <p><span className="text-muted-foreground">{t("type")}</span>: {document.documentType}</p>
                <p><span className="text-muted-foreground">{t("description")}</span>: {document.description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="blue" className="cursor-pointer w-max mt-4">
                    <Link href={document.url} target="blank">{t("view")}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}