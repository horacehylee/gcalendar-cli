import * as google from 'googleapis';
import { authorize } from '../google-oauth2/google-oauth2';
import { promisify } from 'bluebird';
import { default as chalk } from 'chalk';
import { Calendar } from './models/calendar';
import { plainToClass } from 'class-transformer';
import { GCalEvent } from './models/event';
import { flatten, isEmpty } from 'lodash';
import * as addWeeks from 'date-fns/add_weeks';
import * as format from 'date-fns/format';

const error = console.error;

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly'
];

const INSERT_DATE_FORMAT = 'YYYY-MM-DD';
const INSERT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export const getCalendarClient = async () => {
    const oauth2Client = await authorize(SCOPES);
    return google.calendar({ version: 'v3', auth: oauth2Client });
}

export const listCalendars = async (calendar) => {
    const params: any = {
        maxResults: 100,
    };
    const {
        nextPageToken,
        items
    } = await promisify<any, any>(calendar.calendarList.list)(params);
    const calendars = plainToClass<Calendar, {}[]>(Calendar, items);
    return calendars;
}

export interface ListEventOptions {
    timeMin?: Date
    timeMax?: Date
}

export const listEvents = async (calendarClient, calendarId = 'primary', options: ListEventOptions = {}) => {
    const params: any = {
        calendarId: encodeURIComponent(calendarId),
        timeMin: options.timeMin ? options.timeMin.toISOString() : new Date().toISOString(),
        timeMax: options.timeMax ? options.timeMax.toISOString() : addWeeks(new Date(), 1).toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime'
    };
    const calendarClientEventListPromise = promisify<any, any>(calendarClient.events.list);
    try {
        let events = [];
        let pageToken = '';
        do {
            const pagingParams = {
                ...params,
                pageToken: pageToken,
            }
            const {
                nextPageToken,
                items
            } = await calendarClientEventListPromise(pagingParams);
            pageToken = nextPageToken;
            events = events.concat(items);

        } while (!isEmpty(pageToken))

        const gCalEvents = flatten(events.map(GCalEvent.gen));
        return gCalEvents;
    } catch (e) {
        error(`calendarId(${calendarId}) has error`, e);
        throw e;
    }
}

export interface InsertEventOptions {
    summary: string
    start: Date
    end: Date
    isAllDay?: boolean
}

export const insertEvent = (calendarClient: any) => (options: InsertEventOptions) => async (calendarId: string = 'primary') => {
    const { summary, start, end, isAllDay } = options;
    let event: any = {
        summary: summary,
    }
    if (isAllDay) {
        event = {
            ...event,
            start: {
                date: format(start, INSERT_DATE_FORMAT),
            },
            end: {
                date: format(end, INSERT_DATE_FORMAT),
            }
        }
    } else {
        event = {
            ...event,
            start: {
                dateTime: format(start, INSERT_DATETIME_FORMAT),
            },
            end: {
                dateTime: format(end, INSERT_DATETIME_FORMAT),
            }
        }
    }
    let params: any = {
        calendarId: calendarId,
        resource: event,
    }
    try {
        const insertedEvent = await promisify<any, any>(calendarClient.events.insert)(params);
        const gCalEvents = GCalEvent.gen(insertedEvent);
        return gCalEvents;
    } catch (e) {
        error(`calendarId(${calendarId}) insert event error occured`, e);
        throw e;
    }
}