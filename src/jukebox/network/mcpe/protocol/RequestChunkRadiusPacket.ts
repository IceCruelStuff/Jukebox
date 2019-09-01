import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class RequestChunkRadiusPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.REQUEST_CHUNK_RADIUS_PACKET;
    }

    public radius: number;

    _decodePayload() {
        this.radius = this.getVarInt();
    }

    _encodePayload() {
        this.putVarInt(this.radius);
    }

    handle(session): boolean {
        return session.handleRequestChunkRadius(this);
    }
}