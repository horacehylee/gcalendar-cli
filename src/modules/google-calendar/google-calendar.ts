import * as google from 'googleapis';
import { authorize } from '../google-oauth2/google-oauth2';
import { promisify } from 'bluebird';
import * as moment from 'moment';
import { default as chalk } from 'chalk';
import { Calendar } from './models/calendar';
import { plainToClass } from 'class-transformer';
import { GCalEvent } from './models/event';
import { flatten } from 'lodash';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

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

export const listEvents = async (calendar, calendarId = 'primary') => {
    const params: any = {
        calendarId: calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime'
    };
    console.log(params);
    const {
        nextPageToken,
        items: events
    } = await promisify<any, any>(calendar.events.list)(params);
    const gCalEvents = flatten((<any[]>events).map(GCalEvent.gen));



    // if (events.length == 0) {
    //     console.log('No upcoming events found.');
    // } else {
    //     console.log('Upcoming 10 events:');
    //     for (var i = 0; i < events.length; i++) {
    //         var event = events[i];
    //         var start = event.start.dateTime || event.start.date;
    //         console.log('%s - %s', start, event.summary);
    //     }
    // }
    if (events.length === 0) {
        console.log(`No upcoming events found (${params.timeMin} ~ ${params.timeMax || ''})`);
        return;
    }
    console.log(`Upcoming events (${params.timeMin} ~ ${params.timeMax || ''})`);
    events.forEach(event => {
        let start;
        if (event.start.dateTime) {
            start = moment(event.start.dateTime).format(LIST_FORMAT_DATETIME);
        } else {
            start = moment(event.start.date).format(LIST_FORMAT_DATE);
        }
        if (showId) {
            console.log(` ${start} - ${chalk.bold(event.summary)} (${event.id})`);
        } else {
            console.log(` ${start} - ${chalk.bold(event.summary)}`);
        }
    });
    return events;
}