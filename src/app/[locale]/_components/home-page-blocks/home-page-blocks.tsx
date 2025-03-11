import { EventBlock } from "./event-block";
import { HomePageBlocksProps } from "@/types/home-page-blocks";

export async function HomePageBlocks({ events }: HomePageBlocksProps) {

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Alert</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-xl">Species Factsheets</h2>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <EventBlock events={events} />
            </div>
        </div>
    )
}