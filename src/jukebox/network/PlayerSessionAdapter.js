"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Async_1 = require("../utils/Async");
const Chunk_1 = require("../level/format/Chunk");
class PlayerSessionAdapter {
    constructor(player) {
        this.server = player.getServer();
        this.raknetAdapter = this.server.getRakNetAdapter();
        this.player = player;
    }
    sendPacket(packet, needACK = false, immediate = true) {
        return this.raknetAdapter.sendPacket(this.player, packet, needACK, immediate);
    }
    handleResourcePackClientResponse(packet) {
        this.player.handleResourcePackClientResponse(packet);
    }
    handleDataPacket(packet) {
        if (!this.player.isConnected()) {
            return;
        }
        packet.decode();
        if (!packet.feof() && !packet.mayHaveUnreadBytes()) {
            let remains = packet.buffer.slice(packet.offset);
            this.server.getLogger().debug("Still " + remains.length + " bytes unread in " + packet.getName() + ": 0x" + remains.toString("hex"));
        }
        console.log("Got " + packet.getName() + " from " + this);
        packet.handle(this);
        // let ev = new DataPacketReceiveEvent(this.player, packet);
        // this.server.getPluginManager().callEvent(ev);
        // if(!ev.isCancelled() && !packet.handle(this)){
        //     console.log("Unhandled " + packet.getName() + " received from " + this.player.getName() + ": 0x" + packet.buffer.toString("hex"));
        // }
    }
    handlePlayStatus(packet) {
        return false;
    }
    handleResourcePackDataInfo(packet) {
        return false;
    }
    handleResourcePackStack(packet) {
        return false;
    }
    handleStartGame(packet) {
        return false;
    }
    handleSetLocalPlayerAsInitialized(packet) {
        this.player.doFirstSpawn();
        return true;
    }
    handleRequestChunkRadius(packet) {
        console.log("new chunk radius request");
        this.player.setViewDistance(packet.radius);
        Async_1.Async(function () {
            let distance = this.player.getViewDistance();
            for (let chunkX = -distance; chunkX <= distance; chunkX++) {
                for (let chunkZ = -distance; chunkZ <= distance; chunkZ++) {
                    let chunk = new Chunk_1.Chunk(chunkX, chunkZ);
                    for (let x = 0; x < 16; x++) {
                        for (let z = 0; z < 16; z++) {
                            let y = 0;
                            chunk.setBlockId(x, y++, z, 7);
                            chunk.setBlockId(x, y++, z, 3);
                            chunk.setBlockId(x, y++, z, 3);
                            chunk.setBlockId(x, y, z, 2);
                            /*for (let i = y - 1; i >= 0; i--) {
                                chunk.setBlockSkyLight(x, y, z, 0);
                            }*/
                        }
                    }
                    chunk.recalculateHeightMap();
                    this.player.sendChunk(chunk);
                }
            }
        }.bind(this))
            .then(function () {
            console.log("done sending chunks");
        }.bind(this));
        return true;
    }
    handleChunkRadiusUpdated(packet) {
        return false;
    }
}
exports.PlayerSessionAdapter = PlayerSessionAdapter;
//# sourceMappingURL=PlayerSessionAdapter.js.map