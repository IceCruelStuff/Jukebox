import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class UnconnectedPing extends OfflineMessage{

    public pingId: number;

    constructor(stream){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_UNCONNECTED_PING;
    }

    decodePayload() {
        this.pingId = this.getStream().getLong();
        this.getMagic();
    }
}