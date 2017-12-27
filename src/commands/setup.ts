import { CommandModule } from 'yargs';
import { getCalendarClient } from '../modules/google-calendar/google-calendar';
import { loading } from '../modules/promise-loading/promise-loading';
import { log } from './index';
import { get as getEmoji } from 'node-emoji';

export const SetupCommand: CommandModule = {
    command: 'setup',
    aliases: 's',
    describe: 'Setup Google Calendar token',
    builder: {

    },
    handler: async () => {
        await getCalendarClient();
        log(`${getEmoji('heavy_check_mark')} You are ready to go!`);
    }
}