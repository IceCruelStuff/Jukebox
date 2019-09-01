import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class OpenConnectionRequest1 extends OfflineMessage {

    public protocolVersion: number;
    public mtuSize: number;

    constructor(stream){
        super(stream);
    }

    static getId(): any {
        return MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_1;
    }

    decodePayload() {
        this.getMagic();
        this.protocolVersion = this.getStream().getByte();
        this.mtuSize = this.getBuffer().slice(this.getStream().getOffset()).length + 18;
    }
}