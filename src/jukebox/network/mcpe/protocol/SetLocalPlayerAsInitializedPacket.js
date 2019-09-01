"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class SetLocalPlayerAsInitializedPacket extends DataPacket_1.DataPacket {
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.SET_LOCAL_PLAYER_AS_INITIALIZED_PACKET;
    }
    _decodePayload() {
        this.entityRuntimeId = this.getEntityRuntimeId();
    }
    _encodePayload() {
        this.putEntityRuntimeId(this.entityRuntimeId);
    }
    handle(session) {
        return session.handleSetLocalPlayerAsInitialized(this);
    }
}
exports.SetLocalPlayerAsInitializedPacket = SetLocalPlayerAsInitializedPacket;
//# sourceMappingURL=SetLocalPlayerAsInitializedPacket.js.map