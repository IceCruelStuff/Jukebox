import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class ResourcePackClientResponsePacket extends DataPacket{

    public status: number = 0;
    public packIds = [];

    static readonly STATUS_REFUSED = 1;
    static readonly STATUS_SEND_PACKS = 2;
    static readonly STATUS_HAVE_ALL_PACKS = 3;
    static readonly STATUS_COMPLETED = 4;

    static STATUS(status: number){
        switch (status) {
            case ResourcePackClientResponsePacket.STATUS_REFUSED:
                return "REFUSED";
            case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
                return "SEND_PACKS";
            case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
                return "HAVE_ALL_PACKS";
            case ResourcePackClientResponsePacket.STATUS_COMPLETED:
                return "COMPLETED";
        }
    }

    static getId(): any {
        return ProtocolInfo.RESOURCE_PACK_CLIENT_RESPONSE_PACKET;
    }

    _decodePayload() {
        this.status = this.getByte();
        let entryCount = this.getLShort();
        while(entryCount-- > 0){
            this.packIds.push(this.getString());
        }
    }

    _encodePayload() {
        this.putByte(this.status);
        this.putLShort(this.packIds.length);
        this.packIds.forEach(id => {
           this.putString(id);
        });
    }

    handle(session): boolean {
        return session.handleResourcePackClientResponse(this);
    }
}