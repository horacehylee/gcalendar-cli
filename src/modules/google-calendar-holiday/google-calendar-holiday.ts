import * as isSaturday from "date-fns/is_saturday";
import * as isSunday from "date-fns/is_sunday";
import * as isSameDay from "date-fns/is_same_day";
import { flatten, find } from "lodash";

import { listEvents } from "../google-calendar/google-calendar";
import { GCalEvent } from "../google-calendar/models/event";

const HOLIDAY_REGEX = new RegExp("(#holiday@group.v.calendar.google.com)$");

export const verifyCalendarUrl = (url: string) => {
  if (!HOLIDAY_REGEX.test(url)) {
    throw new Error(`url(${url}) is not a valid holiday calendar url`);
  }
};

export const filterCalendarUrl = (urls: string[]): string[] => {
  return urls.filter(url => HOLIDAY_REGEX.test(url));
};

export class HolidayCalendar {
  calendarUrls: string[];
  holidays: Holiday[] = [];

  constructor(calendarUrls: string[]) {
    calendarUrls.forEach(url => verifyCalendarUrl(url));
    this.calendarUrls = calendarUrls;
  }

  async prefetchRange(calendarClient: any, from: Date, to: Date) {
    const listEventPromises = this.calendarUrls.map(calendarId =>
      listEvents(calendarClient, calendarId, {
        timeMin: from,
        timeMax: to
      })
    );
    try {
      const eventPromiseResponses = await Promise.all(listEventPromises);
      const gCalEvents = flatten(eventPromiseResponses);
      const fetchedHolidays = gCalEvents.map(Holiday.gen);
      this.holidays = this.holidays.concat(fetchedHolidays);
    } catch (e) {
      console.log("error", e);
      throw e;
    }
  }

  isHoliday(date: Date): boolean {
    if (isSaturday(date) || isSunday(date)) {
      return true;
    }
    if (find(this.holidays, holiday => isSameDay(holiday.date, date))) {
      return true;
    }
    return false;
  }
}

export class Holiday {
  name: string;
  date: Date;
  calendarUrl: string;
  calendarName: string;

  public static gen(gCalEvent: GCalEvent): Holiday {
    const holiday = new Holiday();
    holiday.name = gCalEvent.summary;
    holiday.date = gCalEvent.date;
    holiday.calendarUrl = gCalEvent.calendarId;
    holiday.calendarName = gCalEvent.calendarDisplayName;
    return holiday;
  }
}
