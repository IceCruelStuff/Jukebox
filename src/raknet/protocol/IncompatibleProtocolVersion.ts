import {OfflineMessage} from "./OfflineMessage";
import {MessageIdentifiers} from "./MessageIdentifiers";

export class IncompatibleProtocolVersion extends OfflineMessage {

    public protocolVersion: number = -1;
    public serverId: number = -1;

    constructor(){
        // @ts-ignore
        super();
    }

    getId(): any {
        return MessageIdentifiers.ID_INCOMPATIBLE_PROTOCOL_VERSION;
    }

    encodePayload() {
        this.getStream().putByte(this.protocolVersion);

        this.putMagic();

        this.getStream().putLong(this.serverId);
    }
}