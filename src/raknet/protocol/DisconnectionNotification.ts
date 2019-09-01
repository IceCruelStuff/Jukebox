import {Packet} from "./Packet";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class DisconnectionNotification extends Packet {

    static getId(): any {
        return MessageIdentifiers.ID_DISCONNECTION_NOTIFICATION;
    }
}