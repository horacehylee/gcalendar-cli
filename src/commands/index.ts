import { Argv } from "yargs";
import { ListCommand } from "./list";

export const registerCommands = (argv: Argv) => {
    argv.command(ListCommand)
    return argv;
}

