"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class OpenConnectionRequest2 extends OfflineMessage_1.OfflineMessage {
    constructor(stream) {
        super(stream);
        this.serverAddress = "";
        this.serverPort = -1;
        this.mtuSize = -1;
        this.clientId = -1;
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_2;
    }
    decodePayload() {
        this.getMagic();
        let addr = this.getStream().getAddress();
        this.serverAddress = addr.ip;
        this.serverPort = addr.port;
        this.mtuSize = this.getStream().getShort();
        this.clientId = this.getStream().getLong();
    }
}
exports.OpenConnectionRequest2 = OpenConnectionRequest2;
//# sourceMappingURL=OpenConnectionRequest2.js.map