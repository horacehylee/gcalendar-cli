import * as google from 'googleapis';
import { authorize } from '../google-oauth2/google-oauth2';
import { promisify } from 'bluebird';
import { default as chalk } from 'chalk';
import { Calendar } from './models/calendar';
import { plainToClass } from 'class-transformer';
import { GCalEvent } from './models/event';
import { flatten } from 'lodash';
import * as addWeeks from 'date-fns/add_weeks';

const error = console.error;

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly'
];

const LIST_FORMAT_DATETIME = 'YYYY-MM-DD HH:mm';
const LIST_FORMAT_DATE = 'YYYY-MM-DD [(All)]';
const showId = false;

export const getCalendarClient = async () => {
    const oauth2Client = await authorize(SCOPES);
    return google.calendar({ version: 'v3', auth: oauth2Client });
}

export const sortEvents = () => {

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
        timeMax: options.timeMax ? options.timeMax.toISOString() : addWeeks(new Date() ,1).toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime'
    };
    try {
        const {
            nextPageToken,
            items: events
        } = await promisify<any, any>(calendarClient.events.list)(params);
        const gCalEvents = flatten((<any[]>events).map(GCalEvent.gen));
        return gCalEvents;
    } catch (e) {
        error(`calendarId(${calendarId}) has error`, e);
        throw e;
    }
}