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

import { verifyCalendarUrl } from './../google-calendar-holiday';

describe('Verify Calendar Url', () => {
    it('should pass example calendar url', () => {
        const calendarUrl = 'en.italian#holiday@group.v.calendar.google.com';
        verifyCalendarUrl(calendarUrl);
    });

    it('should fail with invalid calendar url', () => {
        const calendarUrl = 'en.italian#holiday@group.v.google.com';
        expect(() => verifyCalendarUrl(calendarUrl)).to.throw();
    })
});