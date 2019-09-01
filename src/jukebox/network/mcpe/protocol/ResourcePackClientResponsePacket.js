"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class ResourcePackClientResponsePacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.status = 0;
        this.packIds = [];
    }
    static STATUS(status) {
        switch (status) {
            case ResourcePackClientResponsePacket.STATUS_REFUSED:
                return "REFUSED";
            case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
                return "SEND_PACKS";
            case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
                return "HAVE_ALL_PACKS";
            case ResourcePackClientResponsePacket.STATUS_COMPLETED:
                return "COMPLETED";
        }
    }
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.RESOURCE_PACK_CLIENT_RESPONSE_PACKET;
    }
    _decodePayload() {
        this.status = this.getByte();
        let entryCount = this.getLShort();
        while (entryCount-- > 0) {
            this.packIds.push(this.getString());
        }
    }
    _encodePayload() {
        this.putByte(this.status);
        this.putLShort(this.packIds.length);
        this.packIds.forEach(id => {
            this.putString(id);
        });
    }
    handle(session) {
        return session.handleResourcePackClientResponse(this);
    }
}
exports.ResourcePackClientResponsePacket = ResourcePackClientResponsePacket;
ResourcePackClientResponsePacket.STATUS_REFUSED = 1;
ResourcePackClientResponsePacket.STATUS_SEND_PACKS = 2;
ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS = 3;
ResourcePackClientResponsePacket.STATUS_COMPLETED = 4;
//# sourceMappingURL=ResourcePackClientResponsePacket.js.map