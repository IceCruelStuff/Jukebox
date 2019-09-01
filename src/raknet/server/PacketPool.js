"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnconnectedPing_1 = require("../protocol/UnconnectedPing");
const OpenConnectionRequest1_1 = require("../protocol/OpenConnectionRequest1");
const OpenConnectionRequest2_1 = require("../protocol/OpenConnectionRequest2");
class PacketPool extends Map {
    constructor() {
        super();
        this.registerPackets();
    }
    registerPacket(packet) {
        this.set(packet.getId(), packet);
    }
    getPacket(id) {
        return this.has(id) ? this.get(id) : null;
    }
    registerPackets() {
        this.registerPacket(UnconnectedPing_1.UnconnectedPing);
        this.registerPacket(OpenConnectionRequest1_1.OpenConnectionRequest1);
        this.registerPacket(OpenConnectionRequest2_1.OpenConnectionRequest2);
    }
}
exports.PacketPool = PacketPool;
//# sourceMappingURL=PacketPool.js.map