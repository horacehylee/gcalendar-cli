import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as setSeconds from 'date-fns/set_seconds';
import * as setMilliseconds from 'date-fns/set_milliseconds';

export const resetTime = (date: Date) => setMilliseconds(setHours(setMinutes(setSeconds(date, 0), 0), 0), 0);