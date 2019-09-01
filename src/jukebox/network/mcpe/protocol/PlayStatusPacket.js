"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class PlayStatusPacket extends DataPacket_1.DataPacket {
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.PLAY_STATUS_PACKET;
    }
    canBeSentBeforeLogin() {
        return true;
    }
    _decodePayload() {
        this.status = this.getInt();
    }
    _encodePayload() {
        this.putInt(this.status);
    }
    handle(session) {
        return session.handlePlayStatus(this);
    }
}
exports.PlayStatusPacket = PlayStatusPacket;
PlayStatusPacket.LOGIN_SUCCESS = 0;
PlayStatusPacket.LOGIN_FAILED_CLIENT = 1;
PlayStatusPacket.LOGIN_FAILED_SERVER = 2;
PlayStatusPacket.PLAYER_SPAWN = 3;
PlayStatusPacket.LOGIN_FAILED_INVALID_TENANT = 4;
PlayStatusPacket.LOGIN_FAILED_VANILLA_EDU = 5;
PlayStatusPacket.LOGIN_FAILED_EDU_VANILLA = 6;
//# sourceMappingURL=PlayStatusPacket.js.map