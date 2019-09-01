"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class ResourcePackStackPacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.mustAccept = false;
        this.behaviorPackStack = [];
        this.resourcePackStack = [];
        this.isExperimental = false;
    }
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.RESOURCE_PACK_STACK_PACKET;
    }
    _decodePayload() {
        this.mustAccept = this.getBool();
        let behaviorPackCount = this.getUnsignedVarInt();
        while (behaviorPackCount-- > 0) {
            this.getString();
            this.getString();
            this.getString();
        }
        let resourcePackCount = this.getUnsignedVarInt();
        while (resourcePackCount-- > 0) {
            this.getString();
            this.getString();
            this.getString();
        }
        this.isExperimental = this.getBool();
    }
    _encodePayload() {
        this.putBool(this.mustAccept);
        this.putUnsignedVarInt(this.behaviorPackStack.length);
        this.behaviorPackStack.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putString("");
        });
        this.putUnsignedVarInt(this.resourcePackStack.length);
        this.resourcePackStack.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putString("");
        });
        this.putBool(this.isExperimental);
    }
    handle(session) {
        return session.handleResourcePackStack(this);
    }
}
exports.ResourcePackStackPacket = ResourcePackStackPacket;
//# sourceMappingURL=ResourcePackStackPacket.js.map