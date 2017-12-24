import * as isSameDay from 'date-fns/is_same_day';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as addDays from 'date-fns/add_days';
import * as parse from 'date-fns/parse';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as setSeconds from 'date-fns/set_seconds';

const isAllDay = (event: any) => event.start.date;

const genSummarySuffix = (diffDays: number, index: number) => {
    if (index >= diffDays) {
        throw new Error(`index(${index}) is greater or equal to diffDays(${diffDays})`);
    }
    return ` (Day ${index + 1}/${diffDays})`;
}

const genGCalEvent = (suffix: string) => (event: any, action: (gcalEvent: GCalEvent) => GCalEvent) => {
    const gCalEvent = new GCalEvent();
    gCalEvent.summary = event.summary + suffix;
    gCalEvent.calendarId = event.organizer.email;
    gCalEvent.calendarDisplayName = event.organizer.displayName;
    return action(gCalEvent);
}

const genAllDayGCalEvent = (suffix: string) => (event: any, action: (gcalEvent: GCalEvent) => GCalEvent) => {
    const gCalEvent = genGCalEvent(suffix)(event, action);
    gCalEvent.allDay = true;
    return gCalEvent;
}

const getDate = (dateTime: Date) => {
    let date = setHours(dateTime, 0);
    date = setMinutes(date, 0);
    date = setSeconds(date, 0);
    return date;
}

export class GCalEvent {
    summary: string;
    calendarId: string;
    calendarDisplayName: string;
    date: Date;
    startTime?: Date;
    endTime?: Date;
    allDay?: boolean;

    // Mimic google calendar mobile event
    public static gen(event: any): GCalEvent[] {

        if (isAllDay(event)) {
            const startDate = parse(event.start.date);
            const endDate = parse(event.end.date);
            const diff = differenceInCalendarDays(endDate, startDate);
            if (diff > 1) {
                const events: GCalEvent[] = [];
                for (let i = 0; i < diff; i++) {
                    const date = addDays(startDate, i);
                    const suffix = genSummarySuffix(diff, i);
                    const gCalEvent = genAllDayGCalEvent(suffix)(event, (gCalEvent) => {
                        gCalEvent.date = date;
                        return gCalEvent;
                    });
                    events.push(gCalEvent);
                }
                return events;
            } else {
                const gCalEvent = genAllDayGCalEvent("")(event, (gCalEvent) => {
                    gCalEvent.date = startDate;
                    return gCalEvent;
                });
                return [gCalEvent];
            }
        } else {

            const startTime = parse(event.start.dateTime);
            const endTime = parse(event.end.dateTime);
            const diff = differenceInCalendarDays(endTime, startTime) + 1;
            if (diff > 1) {
                const events: GCalEvent[] = [];
                const startSuffix = genSummarySuffix(diff, 0);
                const startEvent = genGCalEvent(startSuffix)(event, (gCalEvent) => {
                    gCalEvent.startTime = startTime;
                    gCalEvent.date = getDate(startTime);
                    return gCalEvent;
                });
                events.push(startEvent);

                for (let i = 1; i < diff - 1; i++) {
                    let date = addDays(startTime, i);
                    date = getDate(date);

                    const suffix = genSummarySuffix(diff, i);
                    const gCalEvent = genAllDayGCalEvent(suffix)(event, (gCalEvent) => {
                        gCalEvent.date = date;
                        return gCalEvent;
                    });
                    events.push(gCalEvent);
                }

                const endSuffix = genSummarySuffix(diff, diff - 1);
                const endEvent = genGCalEvent(endSuffix)(event, (gCalEvent) => {
                    gCalEvent.endTime = endTime;
                    gCalEvent.date = getDate(endTime);
                    return gCalEvent;
                });
                events.push(endEvent);

                return events;
            } else {
                const gCalEvent = genGCalEvent("")(event, (gCalEvent) => {
                    gCalEvent.date = getDate(startTime);
                    gCalEvent.startTime = startTime;
                    gCalEvent.endTime = endTime;
                    return gCalEvent;
                });
                return [gCalEvent];
            }
        }
    }
}