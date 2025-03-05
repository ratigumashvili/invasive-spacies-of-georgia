import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "@/i18n/routing";

import { fetchStrapiData } from "@/lib/api-calls";
import { TaxonomyAPIResponse } from "@/types/taxonomy-types";

export async function BrowseByTaxonomy({ locale }: { locale: string }) {

    let response: TaxonomyAPIResponse | null;


    try {
        response = await fetchStrapiData("kingdoms", { locale, populate: "*" });
    } catch (error) {
        console.error("Error fetching kingdoms:", error);
        response = null;
    }

    return (
        <>
            {/* <pre>
                from bbt: {JSON.stringify(response, null, 2)}
            </pre> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {response && response?.data?.length !== 0 && response?.data?.map((item) => (
                    <Card key={item.documentId} className="bg-primary text-white flex items-center justify-center p-16">
                        <CardTitle className="text-2xl">
                            <Link href={`/taxonomy/${item.slug}`}>
                               {item.rank.rank} {item.name}
                            </Link>
                        </CardTitle>
                    </Card>
                ))}
            </div>
        </>
    )
}