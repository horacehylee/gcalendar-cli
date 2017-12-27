import { CommandModule } from 'yargs';

import { isEmpty } from 'lodash';
import * as Sherlock from 'sherlockjs';
import * as inquirer from 'inquirer';
import { log, pretty } from './index';
import { resetTime, ppObjDate, diffHours, diffHoursToString } from '../modules/google-calendar/fns/util.fns';
import * as addDays from 'date-fns/add_days';
import * as addHours from 'date-fns/add_hours';
import sentenceCase = require('sentence-case');
import { getCalendarClient, insertEvent } from '../modules/google-calendar/google-calendar';
import chalk from 'chalk';

const END_TIME_HOUR_OFFSET = 1;

export interface ParseInsertResult {
    title: string,
    start: Date,
    end: Date,
    isAllDay: boolean,
}

export const parseInsertCommand = (info: string, duration: number = null): ParseInsertResult => {
    if (isEmpty(info)) {
        throw new Error('info cannot be empty');
    }
    let { eventTitle, startDate, endDate, isAllDay } = Sherlock.parse(info);

    // without start and end date means today only event
    if (!startDate && !endDate) {
        isAllDay = true;
        startDate = resetTime(new Date());
        endDate = startDate;
    }
    // 1 hour event if only start date with time is specificed
    if (startDate && !endDate) {
        endDate = addHours(startDate, END_TIME_HOUR_OFFSET)
    }
    // Apply duration only for non all day event
    if (duration) {
        if (!isAllDay) {
            endDate = addHours(startDate, duration);
        } else {
            log(chalk.yellowBright(`> duration is ignored`));
        }
    }
    // Finally add 1 day for all day end date
    if (isAllDay) {
        endDate = resetTime(addDays(endDate, 1));
    }
    return {
        title: sentenceCase(eventTitle),
        start: startDate,
        end: endDate,
        isAllDay: isAllDay,
    }
}

export const InsertCommand: CommandModule = {
    command: 'insert <info>',
    aliases: 'i',
    describe: 'Insert event into google calendar',
    builder: {
        duration: {
            alias: 'd',
            describe: 'Duration of the event',
            type: 'number',
        },
        calendar: {
            alias: 'c',
            describe: 'Calendar for event to insert',
            type: 'string',
        }
    },
    handler: async (argv) => {
        let { info, duration, calendar } = argv;

        // check calendar exists
        if (!calendar) {
            calendar = 'primary';
        }

        const options = parseInsertCommand(info, duration);
        log(pretty(ppObjDate({
            ...options,
            duration: diffHoursToString(diffHours(options.end, options.start)),
        })));
        const question: inquirer.Question = {
            type: 'confirm',
            name: 'confirm',
            default: false,
            message: `Are you sure to insert this event into calendar?`,
        }
        const { confirm } = await inquirer.prompt(question);
        if (!confirm) {
            return;
        }

        const calendarClient = await getCalendarClient();
        await insertEvent(calendarClient)({
            start: options.start,
            end: options.end,
            isAllDay: options.isAllDay,
            summary: options.title,
        })(calendar)

        log('Event is inserted')
    }
}