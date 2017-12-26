

const pkg = require('./../package.json');
import * as updateNotifier from 'update-notifier';
updateNotifier({ pkg: pkg }).notify();

// import * as program from 'commander';
// program.version(pkg.version);
// program.description(pkg.description);

import * as yargs from 'yargs';

// import { registerCommands } from './commands';
// registerCommands(program);

// import * as googleCalendar from './modules/google-calendar/google-calendar';
// import { flatten } from 'lodash';
// import { renderEventsList, renderEventsTable } from './modules/google-calendar/renderer/cli-renderer';
// import * as Sherlock from 'sherlockjs';
import { registerCommands } from './commands/index';
import { ListCommand } from './commands/list';

// registerCommands(yargs);
yargs
    .command(ListCommand)
    // .command({
    //     command: 'configure <key> [value]',
    //     aliases: ['config', 'cfg'],
    //     describe: 'Set a config variable',
    //     builder: (yargs) => yargs.default('value', 'true'),
    //     handler: (argv) => {
    //         console.log(`setting ${argv.key} to ${argv.value}`)
    //     }
    // })
    // .command('test', 'just for testing', {}, async () => {
    //     const client = await googleCalendar.getCalendarClient();
    //     let calendars = await googleCalendar.listCalendars(client);
    //     const listEventPromises = calendars.map((calendar) => googleCalendar.listEvents(client, calendar.id));
    //     const eventPromiseResponses = await Promise.all(listEventPromises);
    //     const gCalEvents = flatten(eventPromiseResponses);
    //     renderEventsTable(gCalEvents);
    // })
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv

// program
//     .command('test', 'just for testing')
//     .action(async () => {
//         const client = await googleCalendar.getCalendarClient();
//     })

// program.parse(process.argv);