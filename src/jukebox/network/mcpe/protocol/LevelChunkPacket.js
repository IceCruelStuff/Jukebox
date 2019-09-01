"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class LevelChunkPacket extends DataPacket_1.DataPacket {
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.LEVEL_CHUNK_PACKET;
    }
    _decodePayload() {
        this.chunkX = this.getVarInt();
        this.chunkZ = this.getVarInt();
        this.subChunkCount = this.getUnsignedVarInt();
        this.cacheEnabled = this.getBool();
        if (this.cacheEnabled) {
            for (let i = 0, count = this.getUnsignedVarInt(); i < count; ++i) {
                // @ts-ignore
                this.usedBlobHashes.push(this.getLLong());
            }
        }
        this.extraPayload = this.getString();
    }
    _encodePayload() {
        this.putVarInt(this.chunkX);
        this.putVarInt(this.chunkZ);
        this.putUnsignedVarInt(this.subChunkCount);
        this.putBool(this.cacheEnabled);
        if (this.cacheEnabled) {
            this.putUnsignedVarInt(this.usedBlobHashes.length);
            this.usedBlobHashes.forEach(hash => {
                this.putLLong(hash);
            });
        }
        this.putString(this.extraPayload);
    }
}
exports.LevelChunkPacket = LevelChunkPacket;
//# sourceMappingURL=LevelChunkPacket.js.map