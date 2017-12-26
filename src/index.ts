

const pkg = require('./../package.json');
import * as updateNotifier from 'update-notifier';
updateNotifier({ pkg: pkg }).notify();

import * as yargs from 'yargs';
import { registerCommands } from './commands';

const argv = registerCommands(yargs);
argv
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv