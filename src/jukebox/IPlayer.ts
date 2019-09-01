import {ServerOperator} from "./permission/ServerOperator";
import {Player} from "./Player";

export interface IPlayer extends ServerOperator{

    /**
     * @return {boolean}
     */
    isOnline(): boolean;

    /**
     * @return {string}
     */
    getName(): string;

    /**
     * @return {boolean}
     */
    isBanned(): boolean;

    /**
     * @param banned {boolean}
     */
    setBanned(banned: boolean);

    /**
     * @return {boolean}
     */
    isWhitelisted(): boolean;

    /**
     * @param value {boolean}
     */
    setWhitelisted(value: boolean);

    /**
     * @return {Player|null}
     */
    getPlayer(): Player|null;

    /**
     * @return {number|null}
     */
    getFirstPlayed(): number|null;

    /**
     * @return {number|null}
     */
    getLastPlayed(): number|null;

    /**
     * @return {boolean}
     */
    hasPlayedBefore(): boolean;
}