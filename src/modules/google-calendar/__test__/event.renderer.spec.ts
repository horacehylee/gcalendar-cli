import parse from "date-fns/parse";
import {
  renderEventsList,
  renderEventsTable,
} from "./../renderer/cli-renderer";

describe("Event Renderer", () => {
  const gCalEvents = [
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
  ];

  it("should render events in table", () => {
    renderEventsTable(undefined)(gCalEvents);
  });
  it("should return all events list", () => {
    renderEventsList(undefined)(gCalEvents);
  });
});
