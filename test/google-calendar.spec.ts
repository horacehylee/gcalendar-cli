process.env.NODE_ENV = 'test';
import 'mocha';
import { assert, expect, should } from 'chai';
should();
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';

import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as shallowDeepEqual from 'chai-shallow-deep-equal';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(sinonChai);
chai.use(shallowDeepEqual);
chai.use(chaiAsPromised);

import * as googleCalendar from './../src/modules/google-calendar/google-calendar';
import { GCalEvent } from './../src/modules/google-calendar/models/event';
import { renderEventsList } from './../src/modules/google-calendar/renderer/cli-renderer';
import { flatten } from 'lodash';
import * as parse from 'date-fns/parse';

describe('Google Calendar', () => {

    describe('Render', () => {
        describe('Events', () => {
            const events = [
                {
                    summary: '2018',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    allDay: { startDate: '2018-01-21', endDate: '2018-01-22' }
                },
                {
                    summary: 'Run',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    startDateTime: '2017-12-27T18:30:00+08:00',
                    endDateTime: '2017-12-27T19:00:00+08:00'
                },
                {
                    summary: 'Outdark',
                    calendarId: 'abc@gmail.com',
                    startDateTime: '2017-12-25T19:00:00+08:00',
                    endDateTime: '2017-12-25T20:00:00+08:00'
                },
                {
                    summary: 'Run',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    startDateTime: '2018-01-17T18:30:00+08:00',
                    endDateTime: '2018-01-17T19:00:00+08:00'
                }
            ];
            renderEventsList(<any>events);
        });
    });

    describe('Get Client', () => {
        it('should return google calendar client', async () => {
            const client = await googleCalendar.getCalendarClient();
            expect(client).to.not.be.null;
        })
    });

    describe('List calendar', () => {
        it('should return list of calendars', async () => {
            const client = await googleCalendar.getCalendarClient();
            const calendars = await googleCalendar.listCalendars(client);
            expect(calendars).to.not.be.null;
        });
    });

    describe('List events', () => {
        it('should return list of events', async () => {
            const client = await googleCalendar.getCalendarClient();
            const events = await googleCalendar.listEvents(client);
            expect(events).to.not.be.null;
        });
    });
});