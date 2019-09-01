import {CommandSender} from "./CommandSender";
import {Command} from "./Command";

export interface CommandExecutor {

    /**
     * @param sender {CommandSender}
     * @param command {Command}
     * @param label {string}
     * @param args {[]}
     */
    onCommand(sender: CommandSender, command: Command, label: string, args: []): boolean;
}