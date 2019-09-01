"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class OpenConnectionReply2 extends OfflineMessage_1.OfflineMessage {
    constructor() {
        super(...arguments);
        this.serverId = -1;
        this.clientAddress = "";
        this.clientPort = -1;
        this.mtuSize = -1;
        this.serverSecurity = false;
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_OPEN_CONNECTION_REPLY_2;
    }
    encodePayload() {
        this.putMagic();
        this.getStream()
            .putLong(this.serverId)
            .putAddress(this.clientAddress, this.clientPort, 4)
            .putShort(this.mtuSize)
            .putBool(this.serverSecurity);
    }
}
exports.OpenConnectionReply2 = OpenConnectionReply2;
//# sourceMappingURL=OpenConnectionReply2.js.map