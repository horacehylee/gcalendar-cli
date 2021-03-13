import { google, calendar_v3 } from "googleapis";
import { authorize } from "../google-oauth2/google-oauth2";
import { Calendar } from "./models/calendar";
import { plainToClass } from "class-transformer";
import { GCalEvent } from "./models/event";
import { flatten, isEmpty } from "lodash";
import addWeeks from "date-fns/add_weeks";
import format from "date-fns/format";
import { CRED_PATH, TOKEN_PATH } from "../../config";

const error = console.error;

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const INSERT_DATE_FORMAT = "YYYY-MM-DD";
const INSERT_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";

export const getCalendarClient = async (): Promise<calendar_v3.Calendar> => {
  const oauth2Client = await authorize({
    scopes: SCOPES,
    tokenPath: TOKEN_PATH,
    credentialPath: CRED_PATH,
  });
  return google.calendar({ version: "v3", auth: oauth2Client });
};

export const listCalendars = async (calendar: calendar_v3.Calendar) => {
  const params: calendar_v3.Params$Resource$Calendarlist$List = {
    maxResults: 100,
  };
  const { data } = await calendar.calendarList.list(params);
  const { items } = data;
  const calendars = plainToClass<Calendar, {}[]>(Calendar, items);
  return calendars;
};

export interface ListEventOptions {
  timeMin?: Date;
  timeMax?: Date;
}

export const listEvents = async (
  calendarClient: calendar_v3.Calendar,
  calendarId = "primary",
  options: ListEventOptions = {}
) => {
  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId: calendarId,
    timeMin: options.timeMin
      ? options.timeMin.toISOString()
      : new Date().toISOString(),
    timeMax: options.timeMax
      ? options.timeMax.toISOString()
      : addWeeks(new Date(), 1).toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: "startTime",
  };

  try {
    let events = [];
    let pageToken = "";
    do {
      const pagingParams: calendar_v3.Params$Resource$Events$List = {
        ...params,
        pageToken: pageToken,
      };
      const { data } = await calendarClient.events.list(pagingParams);
      const { nextPageToken, items } = data;
      pageToken = nextPageToken;
      events = events.concat(items);
    } while (!isEmpty(pageToken));

    const gCalEvents = flatten(events.map(GCalEvent.gen));
    return gCalEvents;
  } catch (e) {
    error(`calendarId(${calendarId}) has error`, e);
    throw e;
  }
};

export interface InsertEventOptions {
  summary: string;
  start: Date;
  end: Date;
  isAllDay?: boolean;
}

export const insertEvent = (calendarClient: calendar_v3.Calendar) => (
  options: InsertEventOptions
) => async (calendarId: string = "primary") => {
  const { summary, start, end, isAllDay } = options;
  let event: any = {
    summary: summary,
  };
  if (isAllDay) {
    event = {
      ...event,
      start: {
        date: format(start, INSERT_DATE_FORMAT),
      },
      end: {
        date: format(end, INSERT_DATE_FORMAT),
      },
    };
  } else {
    event = {
      ...event,
      start: {
        dateTime: format(start, INSERT_DATETIME_FORMAT),
      },
      end: {
        dateTime: format(end, INSERT_DATETIME_FORMAT),
      },
    };
  }
  let params: any = {
    calendarId: calendarId,
    resource: event,
  };
  try {
    const { data } = await calendarClient.events.insert(params);
    const gCalEvents = GCalEvent.gen(data);
    return gCalEvents;
  } catch (e) {
    error(`calendarId(${calendarId}) insert event error occured`, e);
    throw e;
  }
};
