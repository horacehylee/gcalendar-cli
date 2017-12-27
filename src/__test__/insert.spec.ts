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

import { parseInsertCommand } from './../commands/insert';
import * as parse from 'date-fns/parse';
import * as addDays from 'date-fns/add_days';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as setSeconds from 'date-fns/set_seconds';
import * as setMilliseconds from 'date-fns/set_milliseconds';

const resetTime = (date: Date) => setMilliseconds(setHours(setMinutes(setSeconds(date, 0), 0), 0), 0);

describe('Parse Insert Command', () => {
    describe('Only start date all day event', () => {
        it('should return a all day event', () => {
            const result = parseInsertCommand('movie from 28 Dec 2017');
            expect(result).to.deep.equal({
                title: "Movie",
                start: parse('2017-12-27T16:00:00.000Z'),
                end: parse('2017-12-28T16:00:00.000Z'),
                isAllDay: true,
            })
        })

        it('should be 1 hour event if only start date with time is specificed', () => {
            const result = parseInsertCommand('movie from 28 Dec 2017 2pm');
            expect(result).to.deep.equal({
                title: "Movie",
                start: parse('2017-12-28T06:00:00.000Z'),
                end: parse('2017-12-28T07:00:00.000Z'),
                isAllDay: false,
            })
        })

        it('should pass with start and end date', () => {
            const result = parseInsertCommand('movie from 28 Dec 2017 to 30 Dec 2017');
            expect(result).to.deep.equal({
                title: "Movie",
                start: parse('2017-12-27T16:00:00.000Z'),
                end: parse('2017-12-30T16:00:00.000Z'),
                isAllDay: true,
            })
        })

        it('should mean today if event without start and end date', () => {
            const result = parseInsertCommand('movie');
            expect(result).to.deep.equal({
                title: "Movie",
                start: resetTime(new Date()),
                end: resetTime(addDays(new Date(), 1)),
                isAllDay: true,
            })
        })

        it('should ignore duration if event without start and end date', () => {
            const result = parseInsertCommand('movie', 3);
            expect(result).to.deep.equal({
                title: "Movie",
                start: resetTime(new Date()),
                end: resetTime(addDays(new Date(), 1)),
                isAllDay: true,
            })
        })

        it('should ignore duration without time', () => {
            const result = parseInsertCommand('movie from 28 Dec 2017', 3);
            expect(result).to.deep.equal({
                title: "Movie",
                start: parse('2017-12-27T16:00:00.000Z'),
                end: parse('2017-12-28T16:00:00.000Z'),
                isAllDay: true,
            })
        })

        it('should pass with duration', () => {
            const result = parseInsertCommand('movie from 28 Dec 2017 2pm', 3);
            expect(result).to.deep.equal({
                title: "Movie",
                start: parse('2017-12-28T06:00:00.000Z'),
                end: parse('2017-12-28T09:00:00.000Z'),
                isAllDay: false,
            })
        })
    });
});