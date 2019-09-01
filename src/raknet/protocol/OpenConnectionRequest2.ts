import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class OpenConnectionRequest2 extends OfflineMessage {

    public serverAddress: string = "";
    public serverPort: number = -1;
    public mtuSize: number = -1;
    public clientId: number = -1;

    constructor(stream){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_2;
    }

    decodePayload() {
        this.getMagic();
        let addr = this.getStream().getAddress();
        this.serverAddress = addr.ip;
        this.serverPort = addr.port;
        this.mtuSize = this.getStream().getShort();
        this.clientId = this.getStream().getLong();
    }
}