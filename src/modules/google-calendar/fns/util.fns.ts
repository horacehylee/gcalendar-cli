import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import setSeconds from "date-fns/set_seconds";
import setMilliseconds from "date-fns/set_milliseconds";
import format from "date-fns/format";
import differenceInSeconds from "date-fns/difference_in_seconds";

export const resetTime = (date: Date) =>
  setMilliseconds(setHours(setMinutes(setSeconds(date, 0), 0), 0), 0);

const formatDate = (formatString: string) => (obj) => {
  const objClone = { ...obj };
  for (const [key, value] of Object.entries(objClone)) {
    if (value instanceof Date) {
      objClone[key] = format(value, formatString);
    }
  }
  return objClone;
};
export const ppObjDate = formatDate("MMM D YYYY h:mm A");

export const diffHours = (dateLeft: Date, dateRight: Date) => {
  const diffSeconds = differenceInSeconds(dateLeft, dateRight);
  return diffSeconds / 3600;
};

export const toFixed = (num, fixed) => {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
};

export const diffHoursToMinutes = (
  diffHours: number
): { hours: number; minutes: number } => {
  const hours = Math.floor(diffHours);
  const minuteHour = diffHours - hours;
  const minutes = Math.floor(minuteHour * 60);
  return { hours, minutes };
};

export const diffHoursToString = (diffHours: number): string => {
  const { hours, minutes } = diffHoursToMinutes(diffHours);
  let diffHoursString = "";
  if (hours) {
    diffHoursString += `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (hours && minutes) {
    diffHoursString += " and ";
  }
  if (minutes) {
    diffHoursString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  return diffHoursString;
};
