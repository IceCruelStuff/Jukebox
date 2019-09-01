import {Permissible} from "../permission/Permissible";
import {JukeboxServer} from "../JukeboxServer";

export interface CommandSender  extends Permissible{

    /**
     * @param message {string}
     */
    sendMessage(message: string);

    /**
     * @return {JukeboxServer}
     */
    getServer(): JukeboxServer;

    /**
     * @return {string}
     */
    getName(): string;

    /**
     * Returns the line height of the command-sender's screen. Used for determining sizes for command output pagination
     * such as in the /help command.
     *
     * @return {number}
     */
    getScreenLineHeight(): number;

    /**
     * Sets the line height used for command output pagination for this command sender. `null` will reset it to default.
     *
     * @param height {number|null}
     */
    setScreenLineHeight(height: number);
}