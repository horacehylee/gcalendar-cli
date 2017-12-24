export class GCalEvent {
    summary: string;
    calendarId: string;
    startDateTime?: Date;
    endDateTime?: Date;
    allDay?: GCalAllDayEvent;

    public static gen(event: any) {
        const gCalEvent = new GCalEvent();
        gCalEvent.summary = event.summary;
        gCalEvent.calendarId = event.organizer.email;
        if (event.start.dateTime) {
            gCalEvent.startDateTime = event.start.dateTime;
            gCalEvent.endDateTime = event.end.dateTime;
        } else {
            const allDay = new GCalAllDayEvent();
            allDay.startDate = event.start.date;
            allDay.endDate = event.end.date;
            gCalEvent.allDay = allDay;
        }
        return gCalEvent;
    }
}

export class GCalAllDayEvent extends GCalEvent {
    startDate: Date;
    endDate: Date;
}

