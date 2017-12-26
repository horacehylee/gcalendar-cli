import { GCalEvent } from "../models/event";
import { groupBy, Dictionary, sortBy, each, filter } from 'lodash';
import { resetTime } from "./util.fns";
import * as addDays from 'date-fns/add_days';
import * as isBefore from 'date-fns/is_before';
import * as isAfter from 'date-fns/is_after';
import * as subMilliseconds from 'date-fns/sub_milliseconds';
import * as addMilliseconds from 'date-fns/add_milliseconds';

const maxMillis = (10 ** 8) * 24 * 60 * 60 * 1000;
const maxDate = new Date(maxMillis);
const minDate = new Date(-maxMillis);

const checkDateIsAfterFromDate = (from, date) => {
    return isAfter(date, subMilliseconds(resetTime(from), 1));
}

const checkDateIsBeforeToDate = (to, date) => {
    return isBefore(date, resetTime(to));
}

export const filterWithRange = (from: Date, to: Date) => (gCalEvents: GCalEvent[]): GCalEvent[] => {
    return filter(gCalEvents, (gCalEvent) => {

        let valid = checkDateIsBeforeToDate(to, gCalEvent.date)
            && checkDateIsAfterFromDate(from, gCalEvent.date);

        if (gCalEvent.endTime) {
            valid = valid && isBefore(from, gCalEvent.endTime);
        }
        return valid
    })
}

export const sortWithinDay = (gCalEvent: GCalEvent[]): GCalEvent[] => {
    const sorter = [
        (gCalEvent: GCalEvent) => {
            return gCalEvent.allDay;
        },
        (gCalEvent: GCalEvent) => {
            if (gCalEvent.startTime) {
                return gCalEvent.startTime;
            }
            if (!gCalEvent.startTime && gCalEvent.endTime) {
                return minDate;
            }
            return maxDate;
        },
        (gCalEvent: GCalEvent) => {
            return gCalEvent.summary;
        },
    ];
    return sortBy(gCalEvent, sorter);
}

export const groupAcrossDays = (gCalEvents: GCalEvent[]): Dictionary<GCalEvent[]> => {
    const grouped = groupBy(gCalEvents, (event) => event.date.toISOString());
    return grouped;
}

export const groupAndSort = (gCalEvent: GCalEvent[]): Dictionary<GCalEvent[]> => {
    const grouped = groupAcrossDays(gCalEvent);
    each(grouped, (value, key, list) => {
        list[key] = sortWithinDay(value);
    })
    return grouped;
}