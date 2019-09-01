"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class OpenConnectionReply1 extends OfflineMessage_1.OfflineMessage {
    constructor() {
        super(...arguments);
        this.serverId = -1;
        this.serverSecurity = false;
        this.mtuSize = -1;
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_OPEN_CONNECTION_REPLY_1;
    }
    encodePayload() {
        this.putMagic();
        this.getStream()
            .putLong(this.serverId)
            .putBool(this.serverSecurity)
            .putShort(this.mtuSize);
    }
}
exports.OpenConnectionReply1 = OpenConnectionReply1;
//# sourceMappingURL=OpenConnectionReply1.js.map