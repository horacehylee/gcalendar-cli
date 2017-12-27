import { CommandModule } from 'yargs';
import { getCalendarClient, listCalendars, listEvents } from '../modules/google-calendar/google-calendar';
import { flatten, filter } from 'lodash';
import { renderEventsTable, renderEventsList } from '../modules/google-calendar/renderer/cli-renderer';
import * as Sherlock from 'sherlockjs';
import * as inquirer from 'inquirer';
import * as addDays from 'date-fns/add_days';
import * as parse from 'date-fns/parse';
import * as isBefore from 'date-fns/is_before';
import * as isAfter from 'date-fns/is_after';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as setSeconds from 'date-fns/set_seconds';
import * as setMilliseconds from 'date-fns/set_milliseconds';

import { resetTime, ppObjDate } from '../modules/google-calendar/fns/util.fns';
import { filterWithRange } from '../modules/google-calendar/fns/event.fns';
import { HolidayCalendar, filterCalendarUrl } from '../modules/google-calendar-holiday/google-calendar-holiday';
import { log, pretty } from './index';
import { loading } from './../modules/promise-loading/promise-loading'

const TO_DAY_OFFSET = 3;

export const ListCommand: CommandModule = {
    command: 'list',
    aliases: 'ls',
    describe: 'List google calendar events',
    builder: {
        table: {
            alias: 't',
            describe: 'Display events in table',
            type: 'boolean',
        },
        days: {
            alias: 'd',
            describe: 'Number of days for events',
            type: 'number',
        },
        range: {
            alias: 'r',
            describe: 'Date range of events in natural language',
            type: 'string',
        }
    },
    handler: async (argv) => {
        const { range, table, days } = argv;

        const dayOffset = (days != null) ? days + 1 : TO_DAY_OFFSET;
        let fromDate = new Date();
        let toDate = null;

        if (range) {
            const { startDate, endDate } = Sherlock.parse(range);
            if (startDate) {
                fromDate = startDate;
            }
            if (endDate) {
                toDate = endDate;
            }
        }

        const options = {
            from: fromDate,
            to: toDate ? toDate : resetTime(addDays(fromDate, dayOffset)),
        }
        log(pretty(ppObjDate(options)));

        const calendarClient = await loading({ message: 'Creating calendar client' })(getCalendarClient());
        let calendars = await listCalendars(calendarClient);
        const calendarIds = calendars.map((calendar) => calendar.id);

        const listEventPromises = calendarIds.map((calendarId) => listEvents(calendarClient, calendarId, {
            timeMin: options.from,
            timeMax: options.to,
        }));
        const eventPromiseResponses = await loading({ message: 'Fetching events' })(Promise.all(listEventPromises));
        let gCalEvents = flatten(eventPromiseResponses);
        gCalEvents = filterWithRange(options.from, options.to)(gCalEvents);

        const holidayCalendarUrls = filterCalendarUrl(calendarIds);
        const holidayCalendar = new HolidayCalendar(holidayCalendarUrls);
        await loading({ message: 'Fetching holidays' })(holidayCalendar.prefetchRange(calendarClient, options.from, options.to));

        if (table) {
            renderEventsTable(holidayCalendar)(gCalEvents);
        } else {
            renderEventsList(holidayCalendar)(gCalEvents);
        }
    }
}
