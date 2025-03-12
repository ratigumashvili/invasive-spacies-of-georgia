import { EventItem } from "./event-item";
import { SingleSpecieList } from "./random-specie";

export interface HomePageBlocksProps {
    events: {
        data: EventItem[];
        meta: {
            pagination: {
                page: number;
                pageSize: number;
                pageCount: number;
                total: number;
            };
        };
    } | null,
    randomSpecie?: SingleSpecieList,
    newSpecies?: SingleSpecieList
}