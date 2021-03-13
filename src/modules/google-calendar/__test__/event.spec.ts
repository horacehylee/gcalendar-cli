import { GCalEvent } from "../models/event";
import parse from "date-fns/parse";

describe("GCalEvent gen", () => {
  describe("All day event", () => {
    it("should map into multiple items for multiple days all day event", () => {
      const event = {
        summary: "2018",
        creator: {
          email: "abc@gmail.com",
          displayName: "ABC",
          self: true,
        },
        organizer: {
          email: "unknownorganizer@calendar.google.com",
          displayName: "Unknown Organizer",
        },
        start: {
          date: "2018-01-21",
        },
        end: {
          date: "2018-01-24",
        },
      };
      const gCalEvents = GCalEvent.gen(event);
      expect(gCalEvents).toEqual([
        {
          summary: "2018 (Day 1/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-01-21"),
        },
        {
          summary: "2018 (Day 2/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-01-22"),
        },
        {
          summary: "2018 (Day 3/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-01-23"),
        },
      ]);
    });

    it("should map a single all day event", () => {
      const event = {
        summary: "Single day event",
        organizer: {
          email: "abc@gmail.com",
          displayName: "ABC",
          self: true,
        },
        start: {
          date: "2017-12-24",
        },
        end: {
          date: "2017-12-25",
        },
      };
      const gCalEvents = GCalEvent.gen(event);
      expect(gCalEvents).toEqual([
        {
          summary: "Single day event",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          allDay: true,
          date: parse("2017-12-24"),
        },
      ]);
    });
  });

  describe("Timed event", () => {
    it("should map multiple days event with time to multiple events", () => {
      const event = {
        summary: "Multiple days event with time",
        organizer: {
          email: "unknownorganizer@calendar.google.com",
          displayName: "Google Calendar",
        },
        start: {
          dateTime: "2017-12-27T18:30:00+08:00",
        },
        end: {
          dateTime: "2017-12-29T19:00:00+08:00",
        },
      };
      const gCalEvents = GCalEvent.gen(event);
      expect(gCalEvents).toEqual([
        {
          summary: "Multiple days event with time (Day 1/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          date: parse("2017-12-27"),
          startTime: parse("2017-12-27T18:30:00+08:00"),
        },
        {
          summary: "Multiple days event with time (Day 2/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          allDay: true,
          date: parse("2017-12-28"),
        },
        {
          summary: "Multiple days event with time (Day 3/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          date: parse("2017-12-29"),
          endTime: parse("2017-12-29T19:00:00+08:00"),
        },
      ]);
    });

    it("should map a single timed event", () => {
      const event = {
        summary: "Single timed event",
        organizer: {
          email: "unknownorganizer@calendar.google.com",
          displayName: "Google Calendar",
        },
        start: {
          dateTime: "2017-12-27T18:30:00+08:00",
        },
        end: {
          dateTime: "2017-12-27T19:00:00+08:00",
        },
      };
      const gCalEvents = GCalEvent.gen(event);
      expect(gCalEvents).toEqual([
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T18:30:00+08:00"),
          endTime: parse("2017-12-27T19:00:00+08:00"),
          date: parse("2017-12-27"),
        },
      ]);
    });
  });
});
