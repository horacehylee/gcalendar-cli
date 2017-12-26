const HOLIDAY_REGEX = new RegExp('(#holiday@group.v.calendar.google.com)$', 'g');

export const verifyCalendarUrl = (url: string) => {
    if (!HOLIDAY_REGEX.test(url)) {
        throw new Error(`url(${url}) is not a valid holiday calendar url`);
    }
}

export class HolidayCalendar {

    calendarUrls: string[];

    constructor(calendarUrls: string[]) {
        calendarUrls.forEach(verifyCalendarUrl);
        this.calendarUrls = calendarUrls;
    }

    prefetchRange(from: Date, to: Date) {

    }



    isHoliday(date: Date): boolean {
        return false;
    }
}

export class Holiday {
    name: string
    date: Date
    calendarUrl: string
    calendarName: string
}