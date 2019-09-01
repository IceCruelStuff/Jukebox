import {Packet} from "./Packet";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class ConnectionRequest extends Packet {

    public clientId: number;
    public sendPingTime: number;
    public useSecurity: boolean;

    constructor(stream?){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_CONNECTION_REQUEST;
    }

    encodePayload() {
        this.getStream()
            .putLong(this.clientId)
            .putLong(this.sendPingTime)
            .putBool(this.useSecurity);
    }

    decodePayload() {
        this.clientId = this.getStream().getLong();
        this.sendPingTime = this.getStream().getLong();
        this.useSecurity = this.getStream().getBool();
    }
}