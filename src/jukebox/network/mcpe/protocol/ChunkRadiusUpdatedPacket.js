"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class ChunkRadiusUpdatedPacket extends DataPacket_1.DataPacket {
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.CHUNK_RADIUS_UPDATED_PACKET;
    }
    _decodePayload() {
        this.radius = this.getVarInt();
    }
    _encodePayload() {
        this.putVarInt(this.radius);
    }
    handle(session) {
        return session.handleChunkRadiusUpdated(this);
    }
}
exports.ChunkRadiusUpdatedPacket = ChunkRadiusUpdatedPacket;
//# sourceMappingURL=ChunkRadiusUpdatedPacket.js.map