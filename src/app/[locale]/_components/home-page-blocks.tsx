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
                <CalendarItem start="25" end="28" month="mar" year="2025" />
            </div>
        </div>
    )
}