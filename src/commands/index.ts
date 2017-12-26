import { Argv } from "yargs";
import { ListCommand } from "./list";

export const registerCommands = (yargs: Argv) => {
    yargs.command(ListCommand)
}

