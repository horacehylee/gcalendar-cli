const pkg = require('./../package.json');
import * as updateNotifier from 'update-notifier';
updateNotifier({ pkg: pkg }).notify();

// import * as program from 'commander';
// program.version(pkg.version);
// program.description(pkg.description);

import * as yargs from 'yargs';

import { registerCommands } from './commands';
// registerCommands(program);

import * as googleCalendar from './modules/google-calendar/google-calendar';
yargs.command('test', 'just for testing', {}, async () => {
    const calendar = await googleCalendar.getCalendar();
}).argv

// program
//     .command('test', 'just for testing')
//     .action(async () => {
//         const client = await googleCalendar.getCalendarClient();
//     })

// program.parse(process.argv);