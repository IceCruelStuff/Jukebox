import {Packet} from "./Packet";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class ConnectedPing extends Packet{

    public sendPingTime: number = -1;

    constructor(stream?){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_CONNECTED_PING;
    }

    encodePayload() {
        this.getStream()
            .putLong(this.sendPingTime);
    }

    decodePayload() {
        this.sendPingTime = this.getStream().getLong();
    }
}