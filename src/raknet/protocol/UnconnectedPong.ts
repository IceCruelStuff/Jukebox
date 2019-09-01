import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class UnconnectedPong extends OfflineMessage{

    public serverName: string;
    public serverId: number;
    public pingId: number;

    constructor(){
        super();
    }

    static getId(): any {
        return MessageIdentifiers.ID_UNCONNECTED_PONG;
    }

    encodePayload() {
        this.getStream()
            .putLong(this.pingId)
            .putLong(this.serverId);

        this.putMagic();

        this.getStream()
            .putShort(this.serverName.length)
            .putString(this.serverName);
    }
}