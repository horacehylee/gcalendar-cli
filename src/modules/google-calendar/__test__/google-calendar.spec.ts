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

import * as googleCalendar from '../google-calendar';
import { GCalEvent } from '../models/event';
import { renderEventsList } from '../renderer/cli-renderer';
import { flatten } from 'lodash';
import * as parse from 'date-fns/parse';

describe.skip('Google Calendar', () => {

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