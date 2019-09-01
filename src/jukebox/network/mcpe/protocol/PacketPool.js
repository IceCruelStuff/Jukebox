"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoginPacket_1 = require("./LoginPacket");
const PlayStatusPacket_1 = require("./PlayStatusPacket");
const ResourcePacksInfoPacket_1 = require("./ResourcePacksInfoPacket");
const ResourcePackClientResponsePacket_1 = require("./ResourcePackClientResponsePacket");
const ResourcePackDataInfoPacket_1 = require("./ResourcePackDataInfoPacket");
const ResourcePackStackPacket_1 = require("./ResourcePackStackPacket");
const StartGamePacket_1 = require("./StartGamePacket");
const SetLocalPlayerAsInitializedPacket_1 = require("./SetLocalPlayerAsInitializedPacket");
const LevelChunkPacket_1 = require("./LevelChunkPacket");
const RequestChunkRadiusPacket_1 = require("./RequestChunkRadiusPacket");
const ChunkRadiusUpdatedPacket_1 = require("./ChunkRadiusUpdatedPacket");
class PacketPool {
    constructor() {
        this.packetPool = new Map();
        this.registerPackets();
    }
    registerPacket(packet) {
        this.packetPool.set(packet.getId(), packet);
    }
    getPacket(id) {
        return this.packetPool.has(id) ? new (this.packetPool.get(id))() : null;
    }
    isRegistered(id) {
        return this.packetPool.has(id);
    }
    registerPackets() {
        this.registerPacket(LoginPacket_1.LoginPacket);
        this.registerPacket(PlayStatusPacket_1.PlayStatusPacket);
        this.registerPacket(ResourcePacksInfoPacket_1.ResourcePacksInfoPacket);
        this.registerPacket(ResourcePackClientResponsePacket_1.ResourcePackClientResponsePacket);
        this.registerPacket(ResourcePackDataInfoPacket_1.ResourcePackDataInfoPacket);
        this.registerPacket(ResourcePackStackPacket_1.ResourcePackStackPacket);
        this.registerPacket(StartGamePacket_1.StartGamePacket);
        this.registerPacket(SetLocalPlayerAsInitializedPacket_1.SetLocalPlayerAsInitializedPacket);
        this.registerPacket(LevelChunkPacket_1.LevelChunkPacket);
        this.registerPacket(RequestChunkRadiusPacket_1.RequestChunkRadiusPacket);
        this.registerPacket(ChunkRadiusUpdatedPacket_1.ChunkRadiusUpdatedPacket);
    }
}
exports.PacketPool = PacketPool;
//# sourceMappingURL=PacketPool.js.map