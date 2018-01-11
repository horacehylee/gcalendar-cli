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
  groupAcrossDays,
  sortWithinDay,
  filterWithRange
} from "./../fns/event.fns";
import { GCalEvent } from "../models/event";
import * as parse from "date-fns/parse";

// TODO: need to cater for other timezones
// import * as timezone_mock from "timezone-mock";
// timezone_mock.register("UTC");

describe("Event fns", () => {
  describe("filterByRange", () => {
    const filter = filterWithRange(
      parse("2017-12-26T13:40:07.361Z"),
      parse("2017-12-27T16:00:00.000Z")
    );

    describe("Events", () => {
      it("should filter event ended", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "Ended",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T11:40:07.361Z"),
            endTime: parse("2017-12-26T12:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([]);
      });

      it("should filter event ended with only endTime", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "Ended",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            endTime: parse("2017-12-26T12:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([]);
      });

      it("should filter event with date before from", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "Date before",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            allDay: true,
            date: parse("2017-12-24T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([]);
      });

      it("should not filter event with date edging to", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "Edging to",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            allDay: true,
            date: parse("2017-12-27T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([]);
      });

      it("should not filter event that have startTime only", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "StartTime only",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T08:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([
          {
            summary: "StartTime only",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T08:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ]);
      });

      it("should not filter event that are not started", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "Not started",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T15:40:07.361Z"),
            endTime: parse("2017-12-26T15:59:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([
          {
            summary: "Not started",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T15:40:07.361Z"),
            endTime: parse("2017-12-26T15:59:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ]);
      });

      it("should not filter event started but not ended", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "Started but not ended",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T11:40:07.361Z"),
            endTime: parse("2017-12-26T15:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([
          {
            summary: "Started but not ended",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T11:40:07.361Z"),
            endTime: parse("2017-12-26T15:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ]);
      });

      it("should not filter event in the middle of the range", () => {
        const gCalEvents: GCalEvent[] = [
          {
            summary: "In the middle",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T14:40:07.361Z"),
            endTime: parse("2017-12-26T15:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ];
        const filtered = filter(gCalEvents);
        expect(filtered).to.deep.equal([
          {
            summary: "In the middle",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T14:40:07.361Z"),
            endTime: parse("2017-12-26T15:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          }
        ]);
      });
    });

    describe("Combine", () => {
      const gCalEventss: GCalEvent[] = [
        {
          summary: "Before",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          endTime: parse("2017-12-26T17:00:00+08:00"),
          startTime: parse("2017-12-26T16:00:00+08:00"),
          date: parse("2017-12-25T16:00:00.000Z")
        },
        {
          summary: "In the middle",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          endTime: parse("2017-12-26T15:40:07.361Z"),
          startTime: parse("2017-12-26T12:40:07.361Z"),
          date: parse("2017-12-25T16:00:00.000Z")
        },
        {
          summary: "asdafdvzv (Day 2/2)",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          endTime: parse("2017-12-26T15:30:00.000Z"),
          date: parse("2017-12-25T16:00:00.000Z")
        },
        {
          summary: "asdasd (Day 1/3)",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          startTime: parse("2017-12-26T08:00:00.000Z"),
          date: parse("2017-12-25T16:00:00.000Z")
        },
        {
          summary: "asdasd (Day 2/3)",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          date: parse("2017-12-26T16:00:00.000Z"),
          allDay: true
        },
        {
          summary: "asdasd (Day 3/3)",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          endTime: parse("2017-12-28T09:00:00.000Z"),
          date: parse("2017-12-27T16:00:00.000Z")
        },
        {
          summary: "Boxing Day",
          calendarId: "en.hong_kong#holiday@group.v.calendar.google.com",
          calendarDisplayName: "Holiday",
          date: parse("2017-12-25T16:00:00.000Z"),
          allDay: true
        }
      ];

      it("should filter by two day", () => {
        const filtered = filterWithRange(
          parse("2017-12-26T13:40:07.361Z"),
          parse("2017-12-27T16:00:00.000Z")
        )(gCalEventss);
        expect(filtered).to.be.deep.equal([
          {
            summary: "In the middle",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            endTime: parse("2017-12-26T15:40:07.361Z"),
            startTime: parse("2017-12-26T12:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          },
          {
            summary: "asdafdvzv (Day 2/2)",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            endTime: parse("2017-12-26T15:30:00.000Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          },
          {
            summary: "asdasd (Day 1/3)",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T08:00:00.000Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          },
          {
            summary: "asdasd (Day 2/3)",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            date: parse("2017-12-26T16:00:00.000Z"),
            allDay: true
          },
          {
            summary: "Boxing Day",
            calendarId: "en.hong_kong#holiday@group.v.calendar.google.com",
            calendarDisplayName: "Holiday",
            date: parse("2017-12-25T16:00:00.000Z"),
            allDay: true
          }
        ]);
      });

      it("should filter by one day", () => {
        const filtered = filterWithRange(
          parse("2017-12-26T13:40:07.361Z"),
          parse("2017-12-26T16:00:00.000Z")
        )(gCalEventss);
        expect(filtered).to.be.deep.equal([
          {
            summary: "In the middle",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            endTime: parse("2017-12-26T15:40:07.361Z"),
            startTime: parse("2017-12-26T12:40:07.361Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          },
          {
            summary: "asdafdvzv (Day 2/2)",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            endTime: parse("2017-12-26T15:30:00.000Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          },
          {
            summary: "asdasd (Day 1/3)",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            startTime: parse("2017-12-26T08:00:00.000Z"),
            date: parse("2017-12-25T16:00:00.000Z")
          },
          {
            summary: "Boxing Day",
            calendarId: "en.hong_kong#holiday@group.v.calendar.google.com",
            calendarDisplayName: "Holiday",
            date: parse("2017-12-25T16:00:00.000Z"),
            allDay: true
          }
        ]);
      });
    });
  });

  describe("sortWithinDay", () => {
    it("should sort event with only endTime first", () => {
      const gCalEvents: GCalEvent[] = [
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T20:30:00+08:00"),
          endTime: parse("2017-12-27T21:00:00+08:00"),
          date: parse("2017-12-27")
        },
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          endTime: parse("2017-12-27T22:00:00+08:00"),
          date: parse("2017-12-27")
        }
      ];
      const sorted = sortWithinDay(gCalEvents);
      expect(sorted).to.deep.equal([
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          endTime: parse("2017-12-27T22:00:00+08:00"),
          date: parse("2017-12-27")
        },
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T20:30:00+08:00"),
          endTime: parse("2017-12-27T21:00:00+08:00"),
          date: parse("2017-12-27")
        }
      ]);
    });

    it("should sort by startTime of the event", () => {
      const gCalEvents: GCalEvent[] = [
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T20:30:00+08:00"),
          endTime: parse("2017-12-27T21:00:00+08:00"),
          date: parse("2017-12-27")
        },
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T18:30:00+08:00"),
          endTime: parse("2017-12-27T19:00:00+08:00"),
          date: parse("2017-12-27")
        }
      ];
      const sorted = sortWithinDay(gCalEvents);
      expect(sorted).to.deep.equal([
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T18:30:00+08:00"),
          endTime: parse("2017-12-27T19:00:00+08:00"),
          date: parse("2017-12-27")
        },
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T20:30:00+08:00"),
          endTime: parse("2017-12-27T21:00:00+08:00"),
          date: parse("2017-12-27")
        }
      ]);
    });

    it("should sort all day event first", () => {
      const gCalEvents: GCalEvent[] = [
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T18:30:00+08:00"),
          endTime: parse("2017-12-27T19:00:00+08:00"),
          date: parse("2017-12-27")
        },
        {
          summary: "Something",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2017-12-27")
        }
      ];
      const sorted = sortWithinDay(gCalEvents);
      expect(sorted).to.deep.equal([
        {
          summary: "Something",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2017-12-27")
        },
        {
          summary: "Single timed event",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Google Calendar",
          startTime: parse("2017-12-27T18:30:00+08:00"),
          endTime: parse("2017-12-27T19:00:00+08:00"),
          date: parse("2017-12-27")
        }
      ]);
    });
  });

  describe("groupAcrossDays", () => {
    it("should group by date of events", () => {
      const gCalEvents: GCalEvent[] = [
        {
          summary: "Something",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-02-21")
        },
        {
          summary: "2018 (Day 1/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-01-21")
        },
        {
          summary: "2018 (Day 2/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-01-22")
        },
        {
          summary: "2018 (Day 3/3)",
          calendarId: "unknownorganizer@calendar.google.com",
          calendarDisplayName: "Unknown Organizer",
          allDay: true,
          date: parse("2018-01-23")
        },
        {
          summary: "Single day event",
          calendarId: "abc@gmail.com",
          calendarDisplayName: "ABC",
          allDay: true,
          date: parse("2018-01-21")
        }
      ];
      const gCalEventDict = groupAcrossDays(gCalEvents);
      expect(gCalEventDict).to.be.deep.equal({
        "2018-01-20T16:00:00.000Z": [
          {
            summary: "2018 (Day 1/3)",
            calendarId: "unknownorganizer@calendar.google.com",
            calendarDisplayName: "Unknown Organizer",
            allDay: true,
            date: parse("2018-01-21")
          },
          {
            summary: "Single day event",
            calendarId: "abc@gmail.com",
            calendarDisplayName: "ABC",
            allDay: true,
            date: parse("2018-01-21")
          }
        ],
        "2018-01-21T16:00:00.000Z": [
          {
            summary: "2018 (Day 2/3)",
            calendarId: "unknownorganizer@calendar.google.com",
            calendarDisplayName: "Unknown Organizer",
            allDay: true,
            date: parse("2018-01-22")
          }
        ],
        "2018-01-22T16:00:00.000Z": [
          {
            summary: "2018 (Day 3/3)",
            calendarId: "unknownorganizer@calendar.google.com",
            calendarDisplayName: "Unknown Organizer",
            allDay: true,
            date: parse("2018-01-23")
          }
        ],
        "2018-02-20T16:00:00.000Z": [
          {
            summary: "Something",
            calendarId: "unknownorganizer@calendar.google.com",
            calendarDisplayName: "Unknown Organizer",
            allDay: true,
            date: parse("2018-02-21")
          }
        ]
      });
    });
  });
});
