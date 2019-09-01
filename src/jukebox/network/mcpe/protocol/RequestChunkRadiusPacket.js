"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class RequestChunkRadiusPacket extends DataPacket_1.DataPacket {
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.REQUEST_CHUNK_RADIUS_PACKET;
    }
    _decodePayload() {
        this.radius = this.getVarInt();
    }
    _encodePayload() {
        this.putVarInt(this.radius);
    }
    handle(session) {
        return session.handleRequestChunkRadius(this);
    }
}
exports.RequestChunkRadiusPacket = RequestChunkRadiusPacket;
//# sourceMappingURL=RequestChunkRadiusPacket.js.map