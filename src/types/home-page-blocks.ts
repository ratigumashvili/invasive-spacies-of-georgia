import { EventItem } from "./event-item";

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
    } | null;
}