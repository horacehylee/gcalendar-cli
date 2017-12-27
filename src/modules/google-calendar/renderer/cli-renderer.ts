import { GCalEvent } from "../models/event";
import { groupAndSort } from './../fns/event.fns';
import * as parse from 'date-fns/parse';
import * as format from 'date-fns/format';
import * as Table from 'cli-table2';
import { default as chalk } from 'chalk';
import * as emoji from 'node-emoji';
import * as isSameDay from 'date-fns/is_same_day';
import { HolidayCalendar } from "../../google-calendar-holiday/google-calendar-holiday";

const log = console.log;
const DATE_FORMAT = 'MMM D (ddd)';
const TIME_FORMAT = 'h:mm A';

class RenderEventOptions {
    renderDateHeader: (dateString: string) => any[];
    renderEventItem: (gCalEvent: GCalEvent, timeRange: string) => any[];
    checkHoliday: (date: Date) => boolean;
}

const _renderEvents = (options: RenderEventOptions) => (gCalEvents: GCalEvent[]) => {
    const {
        renderDateHeader,
        renderEventItem,
        checkHoliday,
    } = options;

    let table = new Table();
    if (gCalEvents.length === 0) {
        log(`No events`);
        return;
    }

    const today = new Date();

    const gCalEventDict = groupAndSort(gCalEvents);
    for (const [key, gCalEvents] of Object.entries(gCalEventDict)) {
        const date = parse(key);
        let dateString = format(date, DATE_FORMAT);
        if (isSameDay(today, date)) {
            dateString += '\n(Today)';
        }
        if (checkHoliday(date)) {
            dateString = chalk.redBright(dateString);
        }
        table.push(
            renderDateHeader(dateString),
        );

        for (const gCalEvent of gCalEvents) {
            let timeRange = '';
            if (gCalEvent.allDay) {
                timeRange = 'All Day';
            } else if (gCalEvent.startTime && !gCalEvent.endTime) {
                timeRange = `${format(gCalEvent.startTime, TIME_FORMAT)}`;
            } else if (!gCalEvent.startTime && gCalEvent.endTime) {
                timeRange = `Until ${format(gCalEvent.endTime, TIME_FORMAT)}`;
            } else if (gCalEvent.startTime && gCalEvent.endTime) {
                timeRange = `${format(gCalEvent.startTime, TIME_FORMAT)}-${format(gCalEvent.endTime, TIME_FORMAT)}`;
            }
            table.push(
                renderEventItem(gCalEvent, timeRange),
            );
        }
    }
    log(table.toString());
}

const checkWithHolidayCalendar = (holidayCalendar: HolidayCalendar) => (date: Date): boolean => {
    return holidayCalendar.isHoliday(date);
}

export const renderEventsList = (holidayCalendar: HolidayCalendar) => _renderEvents({
    renderDateHeader: (dateString) => {
        return [{ colSpan: 3, content: dateString, hAlign: 'center' }];
    },
    renderEventItem: (gCalEvent, timeRange) => {
        return [timeRange, gCalEvent.calendarDisplayName, chalk.bold(gCalEvent.summary)];
    },
    checkHoliday: checkWithHolidayCalendar(holidayCalendar),
});

export const renderEventsTable = (holidayCalendar: HolidayCalendar) => _renderEvents({
    renderDateHeader: (dateString) => {
        return [{ colSpan: 1, content: dateString, hAlign: 'center' }];
    },
    renderEventItem: (gCalEvent, timeRange) => {
        return [`${chalk.bold(gCalEvent.summary)}\n${timeRange}\n${gCalEvent.calendarDisplayName}`];
    },
    checkHoliday: checkWithHolidayCalendar(holidayCalendar),
});