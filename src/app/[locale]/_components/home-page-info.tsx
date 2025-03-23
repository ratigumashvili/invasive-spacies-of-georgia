import { getAllSpeciesCount } from "@/lib/api-calls"

export async function HomePageInfo({locale}: {locale: string}) {
    
    const response = await getAllSpeciesCount(locale)
    
    return (
        <div>
            Spcies count
            <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
    )
}