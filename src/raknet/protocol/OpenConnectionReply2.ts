import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class OpenConnectionReply2 extends OfflineMessage {

    public serverId: number = -1;
    public clientAddress: string = "";
    public clientPort: number = -1;
    public mtuSize: number = -1;
    public serverSecurity: boolean = false;

    static getId(): any {
        return MessageIdentifiers.ID_OPEN_CONNECTION_REPLY_2;
    }

    encodePayload() {
        this.putMagic();
        this.getStream()
            .putLong(this.serverId)
            .putAddress(this.clientAddress, this.clientPort, 4)
            .putShort(this.mtuSize)
            .putBool(this.serverSecurity);
    }
}