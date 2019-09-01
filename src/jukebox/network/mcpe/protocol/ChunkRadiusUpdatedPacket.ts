import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class ChunkRadiusUpdatedPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.CHUNK_RADIUS_UPDATED_PACKET;
    }

    public radius: number;

    _decodePayload() {
        this.radius = this.getVarInt();
    }

    _encodePayload() {
        this.putVarInt(this.radius);
    }

    handle(session): boolean {
        return session.handleChunkRadiusUpdated(this);
    }
}