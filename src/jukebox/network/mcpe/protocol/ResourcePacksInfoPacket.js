"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class ResourcePacksInfoPacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.behaviorPackEntries = [];
        this.resourcePackEntries = [];
    }
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.RESOURCE_PACKS_PACKET;
    }
    _decodePayload() {
        this.mustAccept = this.getBool();
        this.hasScripts = this.getBool();
        let behaviorPackCount = this.getLShort();
        while (behaviorPackCount-- > 0) {
            this.getString();
            this.getString();
            this.getLLong();
            this.getString();
            this.getString();
            this.getString();
            this.getBool();
        }
        let resourcePackCount = this.getLShort();
        while (resourcePackCount-- > 0) {
            this.getString();
            this.getString();
            this.getLLong();
            this.getString();
            this.getString();
            this.getString();
            this.getBool();
        }
    }
    _encodePayload() {
        this.putBool(this.mustAccept);
        this.putBool(this.hasScripts);
        this.putLShort(this.behaviorPackEntries.length);
        this.behaviorPackEntries.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putLLong(entry.getPackSize());
            this.putString("");
            this.putString("");
            this.putString("");
            this.putBool(false);
        });
        this.putLShort(this.resourcePackEntries.length);
        this.resourcePackEntries.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putLLong(entry.getPackSize());
            this.putString("");
            this.putString("");
            this.putString("");
            this.putBool(false);
        });
    }
}
exports.ResourcePacksInfoPacket = ResourcePacksInfoPacket;
//# sourceMappingURL=ResourcePacksInfoPacket.js.map