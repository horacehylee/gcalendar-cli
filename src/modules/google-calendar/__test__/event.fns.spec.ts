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

import { groupAcrossDays, sortWithinDay } from './../fns/event.fns';
import { GCalEvent } from '../models/event';
import * as parse from 'date-fns/parse';

describe('Event fns', () => {

    describe('groupAcrossDays', () => {
        it('should group by date of events', () => {
            const gCalEvents: GCalEvent[] = [
                {
                    summary: 'Something',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    calendarDisplayName: 'Unknown Organizer',
                    allDay: true,
                    date: parse('2018-02-21'),
                },
                {
                    summary: '2018 (Day 1/3)',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    calendarDisplayName: 'Unknown Organizer',
                    allDay: true,
                    date: parse('2018-01-21'),
                },
                {
                    summary: '2018 (Day 2/3)',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    calendarDisplayName: 'Unknown Organizer',
                    allDay: true,
                    date: parse('2018-01-22'),
                },
                {
                    summary: '2018 (Day 3/3)',
                    calendarId: 'unknownorganizer@calendar.google.com',
                    calendarDisplayName: 'Unknown Organizer',
                    allDay: true,
                    date: parse('2018-01-23'),
                },
                {
                    summary: 'Single day event',
                    calendarId: 'abc@gmail.com',
                    calendarDisplayName: 'ABC',
                    allDay: true,
                    date: parse('2018-01-21'),
                }
            ];
            const gCalEventDict = groupAcrossDays(gCalEvents);
            expect(gCalEventDict).to.be.deep.equal({
                '2018-01-20T16:00:00.000Z': [
                    {
                        summary: '2018 (Day 1/3)',
                        calendarId: 'unknownorganizer@calendar.google.com',
                        calendarDisplayName: 'Unknown Organizer',
                        allDay: true,
                        date: parse('2018-01-21'),
                    },
                    {
                        summary: 'Single day event',
                        calendarId: 'abc@gmail.com',
                        calendarDisplayName: 'ABC',
                        allDay: true,
                        date: parse('2018-01-21'),
                    }
                ],
                '2018-01-21T16:00:00.000Z': [
                    {
                        summary: '2018 (Day 2/3)',
                        calendarId: 'unknownorganizer@calendar.google.com',
                        calendarDisplayName: 'Unknown Organizer',
                        allDay: true,
                        date: parse('2018-01-22'),
                    },
                ],
                '2018-01-22T16:00:00.000Z': [
                    {
                        summary: '2018 (Day 3/3)',
                        calendarId: 'unknownorganizer@calendar.google.com',
                        calendarDisplayName: 'Unknown Organizer',
                        allDay: true,
                        date: parse('2018-01-23'),
                    },
                ],
                '2018-02-20T16:00:00.000Z': [
                    {
                        summary: 'Something',
                        calendarId: 'unknownorganizer@calendar.google.com',
                        calendarDisplayName: 'Unknown Organizer',
                        allDay: true,
                        date: parse('2018-02-21'),
                    },
                ],
            })
        })
    })
})