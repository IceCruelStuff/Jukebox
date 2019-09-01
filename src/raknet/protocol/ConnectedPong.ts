import {Packet} from "./Packet";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class ConnectedPong extends Packet {

    public sendPingTime: number;
    public sendPongTime: number;

    constructor(stream?){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_CONNECTED_PONG;
    }

    encodePayload() {
        this.getStream()
            .putLong(this.sendPingTime)
            .putLong(this.sendPongTime);
    }

    decodePayload() {
        this.sendPingTime = this.getStream().getLong();
        this.sendPongTime = this.getStream().getLong();
    }
}