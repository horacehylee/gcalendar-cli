import {
  verifyCalendarUrl,
  HolidayCalendar,
} from "./../google-calendar-holiday";
import { getCalendarClient } from "../../google-calendar/google-calendar";
import parse from "date-fns/parse";

describe.skip("Verify Calendar Url", () => {
  it("should pass example calendar url", () => {
    const calendarUrl = "en.italian#holiday@group.v.calendar.google.com";
    verifyCalendarUrl(calendarUrl);
  });

  it("should fail with invalid calendar url", () => {
    const calendarUrl = "en.italian#holiday@group.v.google.com";
    expect(() => verifyCalendarUrl(calendarUrl)).toThrowError();
  });
});

describe.skip("Prefetch range", () => {
  let hd: HolidayCalendar;
  let calendarClient: any;

  beforeAll(async () => {
    const calendarUrls = ["en.usa#holiday@group.v.calendar.google.com"];
    hd = new HolidayCalendar(calendarUrls);
    calendarClient = await getCalendarClient();
  });

  it("should fetch holidays", async () => {
    const from = parse("2017-12-01T00:00:00Z");
    const to = parse("2018-01-01T00:00:00Z");
    await hd.prefetchRange(calendarClient, from, to);
    expect(hd.holidays.length).toBeGreaterThan(0);
  });
});

describe.skip("isHoliday", () => {
  let hd: HolidayCalendar;
  let calendarClient: any;

  beforeAll(async () => {
    const calendarUrls = ["en.usa#holiday@group.v.calendar.google.com"];
    hd = new HolidayCalendar(calendarUrls);
    calendarClient = await getCalendarClient();

    const from = parse("2017-12-01T00:00:00Z");
    const to = parse("2018-01-01T00:00:00Z");
    await hd.prefetchRange(calendarClient, from, to);
  });

  it("should return true for saturday", async () => {
    const holiday = hd.isHoliday(parse("2017-12-23"));
    expect(holiday).toBeTruthy();
  });

  it("should return true for sunday", () => {
    const holiday = hd.isHoliday(parse("2017-12-24"));
    expect(holiday).toBeTruthy();
  });

  it("should return true for holiday", () => {
    const holiday = hd.isHoliday(parse("2017-12-25"));
    expect(holiday).toBeTruthy();
  });

  it("should return false for non-holidays", () => {
    const holiday = hd.isHoliday(parse("2017-12-26"));
    expect(holiday).toBeFalsy();
  });
});
