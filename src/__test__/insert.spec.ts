import { parseInsertCommand } from "./../commands/insert";
import * as parse from "date-fns/parse";
import * as addDays from "date-fns/add_days";
import * as setHours from "date-fns/set_hours";
import * as setMinutes from "date-fns/set_minutes";
import * as setSeconds from "date-fns/set_seconds";
import * as setMilliseconds from "date-fns/set_milliseconds";

const resetTime = (date: Date) =>
  setMilliseconds(setHours(setMinutes(setSeconds(date, 0), 0), 0), 0);

describe("Parse Insert Command", () => {
  describe("Only start date all day event", () => {
    it("should return a all day event", () => {
      const result = parseInsertCommand("movie from 28 Dec 2017");
      expect(result).toEqual({
        title: "Movie",
        start: parse("2017-12-28T00:00.000"),
        end: parse("2017-12-29T00:00.000"),
        isAllDay: true
      });
    });

    it("should be 1 hour event if only start date with time is specificed", () => {
      const result = parseInsertCommand("movie from 28 Dec 2017 2pm");
      expect(result).toEqual({
        title: "Movie",
        start: parse("2017-12-28T14:00:00.000"),
        end: parse("2017-12-28T15:00:00.000"),
        isAllDay: false
      });
    });

    it("should pass with start and end date", () => {
      const result = parseInsertCommand(
        "movie from 28 Dec 2017 to 30 Dec 2017"
      );
      expect(result).toEqual({
        title: "Movie",
        start: parse("2017-12-28T00:00:00.000"),
        end: parse("2017-12-31T00:00:00.000"),
        isAllDay: true
      });
    });

    it("should mean today if event without start and end date", () => {
      const result = parseInsertCommand("movie");
      expect(result).toEqual({
        title: "Movie",
        start: resetTime(new Date()),
        end: resetTime(addDays(new Date(), 1)),
        isAllDay: true
      });
    });

    it("should ignore duration if event without start and end date", () => {
      const result = parseInsertCommand("movie", 3);
      expect(result).toEqual({
        title: "Movie",
        start: resetTime(new Date()),
        end: resetTime(addDays(new Date(), 1)),
        isAllDay: true
      });
    });

    it("should ignore duration without time", () => {
      const result = parseInsertCommand("movie from 28 Dec 2017", 3);
      expect(result).toEqual({
        title: "Movie",
        start: parse("2017-12-28T00:00:00.000"),
        end: parse("2017-12-29T00:00:00.000"),
        isAllDay: true
      });
    });

    it("should pass with duration", () => {
      const result = parseInsertCommand("movie from 28 Dec 2017 2pm", 3);
      expect(result).toEqual({
        title: "Movie",
        start: parse("2017-12-28T14:00:00.000"),
        end: parse("2017-12-28T17:00:00.000"),
        isAllDay: false
      });
    });
  });
});
