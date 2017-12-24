import { GCalEvent } from "../models/event";
import { groupBy, Dictionary } from 'lodash';

export const sortWithinDay = (gCalEvent: GCalEvent[]): GCalEvent[] => {
    return [];
}

export const groupAcrossDays = (gCalEvent: GCalEvent[]): Dictionary<GCalEvent[]> => {
    const grouped = groupBy(gCalEvent, (event) => event.date.toISOString());
    return grouped;
}