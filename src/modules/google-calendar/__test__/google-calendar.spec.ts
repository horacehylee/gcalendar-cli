process.env.NODE_ENV = "test";
import googleCalendar from "../google-calendar";
import { GCalEvent } from "../models/event";
import { renderEventsList } from "../renderer/cli-renderer";
import { flatten } from "lodash";
import parse from "date-fns/parse";

describe.skip("Google Calendar", () => {
  describe("Get Client", () => {
    it("should return google calendar client", async () => {
      const client = await googleCalendar.getCalendarClient();
      expect(client).toBeDefined();
    });
  });

  describe("List calendar", () => {
    it("should return list of calendars", async () => {
      const client = await googleCalendar.getCalendarClient();
      const calendars = await googleCalendar.listCalendars(client);
      expect(calendars).toBeDefined();
    });
  });

  describe("List events", () => {
    it("should return list of events", async () => {
      const client = await googleCalendar.getCalendarClient();
      const events = await googleCalendar.listEvents(client);
      expect(events).toBeDefined();
    });
  });
});
