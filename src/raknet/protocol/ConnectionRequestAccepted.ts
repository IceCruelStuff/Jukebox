import {Packet} from "./Packet";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class ConnectionRequestAccepted extends Packet {

    public address: string;
    public port: number;
    public systemAddresses = [
        ["127.0.0.1", 0, 4]
    ];
    public sendPingTime: number;
    public sendPongTime: number;

    static getId(): any {
        return MessageIdentifiers.ID_CONNECTION_REQUEST_ACCEPTED;
    }

    encodePayload() {
        this.getStream()
            .putAddress(this.address, this.port, 4)
            .putShort(0);

        for(let i = 0; i < 20; ++i){
            let addr = typeof this.systemAddresses[i] !== "undefined" ? this.systemAddresses[i] : ["0.0.0.0", 0, 4];
            this.getStream().putAddress(addr[0], addr[1], addr[2]);
        }

        this.getStream()
            .putLong(this.sendPingTime)
            .putLong(this.sendPongTime);
    }

}