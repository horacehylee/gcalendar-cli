import { Argv } from "yargs";
import { ListCommand } from "./list";
import { InsertCommand } from "./insert";

export const registerCommands = (argv: Argv) => {
    argv.command(ListCommand)
    argv.command(InsertCommand)
    return argv;
}

export const log = console.log;
export const pretty = (obj) => JSON.stringify(obj, null, 2);