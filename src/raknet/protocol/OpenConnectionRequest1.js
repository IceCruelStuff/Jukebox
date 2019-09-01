"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class OpenConnectionRequest1 extends OfflineMessage_1.OfflineMessage {
    constructor(stream) {
        super(stream);
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_1;
    }
    decodePayload() {
        this.getMagic();
        this.protocolVersion = this.getStream().getByte();
        this.mtuSize = this.getBuffer().slice(this.getStream().getOffset()).length + 18;
    }
}
exports.OpenConnectionRequest1 = OpenConnectionRequest1;
//# sourceMappingURL=OpenConnectionRequest1.js.map