import { EventItem } from "./event-item";
import { RandomSpecie } from "./random-specie";

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
    randomSpecie?: RandomSpecie
}