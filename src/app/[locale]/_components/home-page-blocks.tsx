import { CalendarItem } from "@/app/[locale]/_components/calendar-item";

export async function HomePageBlocks() {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Alert</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Factsheets</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Events</h2>
                <CalendarItem id="1" start="25" end="28" startMonth="mar" year="2025" title="EMCA Conference 2025" location="Antwerp, Belgium" />
                <CalendarItem id="2" start="14" end="17" startMonth="apr" year="2025" title="National Forum on Biological Control Conference" location="Maryland, USA" />
                <CalendarItem id="3" start="21" end="24" startMonth="sep" year="2025" title="5th International Congress on Biological Invasions" location="Perth, Australia" />
            </div>
        </div>
    )
}