"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
const ResourcePackType_1 = require("./types/ResourcePackType");
class ResourcePackDataInfoPacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.isPremium = false;
        this.packType = ResourcePackType_1.ResourcePackType.RESOURCES;
    }
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.RESOURCE_PACK_DATA_PACKET;
    }
    _decodePayload() {
        this.packId = this.getString();
        this.maxChunkSize = this.getLInt();
        this.chunkCount = this.getLInt();
        this.compressedPackSize = this.getLLong();
        this.sha256 = this.getString();
        this.isPremium = this.getBool();
        this.packType = this.getByte();
    }
    _encodePayload() {
        this.putString(this.packId);
        this.putLInt(this.maxChunkSize);
        this.putLInt(this.chunkCount);
        this.putLLong(this.compressedPackSize);
        this.putString(this.sha256);
        this.putBool(this.isPremium);
        this.putByte(this.packType);
    }
    handle(session) {
        return session.handleResourcePackDataInfo(this);
    }
}
exports.ResourcePackDataInfoPacket = ResourcePackDataInfoPacket;
//# sourceMappingURL=ResourcePackDataInfoPacket.js.map