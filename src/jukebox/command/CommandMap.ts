import {Command} from "./Command";
import {CommandSender} from "./CommandSender";

export interface CommandMap {

    /**
     * @param fallbackPrefix {string}
     * @param commands {[]}
     */
    registerAll(fallbackPrefix: string, commands: []);

    /**
     * @param fallbackPrefix {string}
     * @param command {Command}
     * @param label {string|null}
     *
     * @return {boolean}
     */
    register(fallbackPrefix: string, command: Command, label: string): boolean;

    /**
     * @param sender {CommandSender}
     * @param cmdLine {string}
     *
     * @return {boolean}
     */
    dispatch(sender: CommandSender, cmdLine: string): boolean;

    clearCommands(): void;

    /**
     * @param name {string}
     *
     * @return {Command|null}
     */
    getCommand(name: string): Command|null;
}