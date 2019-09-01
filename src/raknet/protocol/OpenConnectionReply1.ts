import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class OpenConnectionReply1 extends OfflineMessage {

    public serverId: number = -1;
    public serverSecurity: boolean = false;
    public mtuSize: number = -1;

    static getId(): any {
        return MessageIdentifiers.ID_OPEN_CONNECTION_REPLY_1;
    }

    encodePayload() {
        this.putMagic();
        this.getStream()
            .putLong(this.serverId)
            .putBool(this.serverSecurity)
            .putShort(this.mtuSize);
    }
}