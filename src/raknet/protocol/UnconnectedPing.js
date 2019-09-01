"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class UnconnectedPing extends OfflineMessage_1.OfflineMessage {
    constructor(stream) {
        super(stream);
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_UNCONNECTED_PING;
    }
    decodePayload() {
        this.pingId = this.getStream().getLong();
        this.getMagic();
    }
}
exports.UnconnectedPing = UnconnectedPing;
//# sourceMappingURL=UnconnectedPing.js.map