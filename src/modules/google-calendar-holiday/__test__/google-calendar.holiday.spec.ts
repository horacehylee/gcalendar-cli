process.env.NODE_ENV = "test";
import "mocha";
import { assert, expect, should } from "chai";
should();
import * as sinon from "sinon";
import { SinonStub } from "sinon";

import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as shallowDeepEqual from "chai-shallow-deep-equal";
import * as chaiAsPromised from "chai-as-promised";
chai.use(sinonChai);
chai.use(shallowDeepEqual);
chai.use(chaiAsPromised);

import {
  verifyCalendarUrl,
  HolidayCalendar
} from "./../google-calendar-holiday";
import { getCalendarClient } from "../../google-calendar/google-calendar";
import * as parse from "date-fns/parse";

const myBefore: any = (global as any).before
  ? (global as any).before
  : (global as any).beforeAll;

describe("Verify Calendar Url", () => {
  it("should pass example calendar url", () => {
    const calendarUrl = "en.italian#holiday@group.v.calendar.google.com";
    verifyCalendarUrl(calendarUrl);
  });

  it("should fail with invalid calendar url", () => {
    const calendarUrl = "en.italian#holiday@group.v.google.com";
    expect(() => verifyCalendarUrl(calendarUrl)).to.throw();
  });
});

describe.skip("Prefetch range", () => {
  let hd: HolidayCalendar;
  let calendarClient: any;

  myBefore(async () => {
    const calendarUrls = ["en.usa#holiday@group.v.calendar.google.com"];
    hd = new HolidayCalendar(calendarUrls);
    calendarClient = await getCalendarClient();
  });

  it("should fetch holidays", async () => {
    const from = parse("2017-12-01T00:00:00Z");
    const to = parse("2018-01-01T00:00:00Z");
    await hd.prefetchRange(calendarClient, from, to);
    expect(hd.holidays).to.not.be.empty;
  });
});

describe.skip("isHoliday", () => {
  let hd: HolidayCalendar;
  let calendarClient: any;

  myBefore(async () => {
    const calendarUrls = ["en.usa#holiday@group.v.calendar.google.com"];
    hd = new HolidayCalendar(calendarUrls);
    calendarClient = await getCalendarClient();

    const from = parse("2017-12-01T00:00:00Z");
    const to = parse("2018-01-01T00:00:00Z");
    await hd.prefetchRange(calendarClient, from, to);
  });

  it("should return true for saturday", async () => {
    const holiday = hd.isHoliday(parse("2017-12-23"));
    expect(holiday).to.be.true;
  });

  it("should return true for sunday", () => {
    const holiday = hd.isHoliday(parse("2017-12-24"));
    expect(holiday).to.be.true;
  });

  it("should return true for holiday", () => {
    const holiday = hd.isHoliday(parse("2017-12-25"));
    expect(holiday).to.be.true;
  });

  it("should return false for non-holidays", () => {
    const holiday = hd.isHoliday(parse("2017-12-26"));
    expect(holiday).to.be.false;
  });
});
