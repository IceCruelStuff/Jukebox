import {Packet} from "./Packet";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class NewIncomingConnection extends Packet{

    public address: string;
    public port: number;

    public systemAddresses: any[] = [];

    public sendPingTime: number;
    public sendPongTime: number;


    constructor(stream?){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_NEW_INCOMING_CONNECTION;
    }

    encodePayload() {}

    decodePayload() {
        let addr = this.getStream().getAddress();
        this.address = addr.ip;
        this.port = addr.port;

        let stopOffset = this.getBuffer().length - 16;
        for(let i = 0; i < 20; ++i){
            if(this.getStream().offset >= stopOffset){
                this.systemAddresses.push(["0.0.0.0", 0, 4]);
            }else{
                let addr = this.getStream().getAddress();
                this.systemAddresses.push([addr.ip, addr.port, addr.version]);
            }
        }

        this.sendPingTime = this.getStream().getLong();
        this.sendPongTime = this.getStream().getLong();
    }
}