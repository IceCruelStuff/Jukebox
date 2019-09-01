"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class UnconnectedPong extends OfflineMessage_1.OfflineMessage {
    constructor() {
        super();
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_UNCONNECTED_PONG;
    }
    encodePayload() {
        this.getStream()
            .putLong(this.pingId)
            .putLong(this.serverId);
        this.putMagic();
        this.getStream()
            .putShort(this.serverName.length)
            .putString(this.serverName);
    }
}
exports.UnconnectedPong = UnconnectedPong;
//# sourceMappingURL=UnconnectedPong.js.map