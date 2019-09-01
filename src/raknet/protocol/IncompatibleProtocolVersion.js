"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("./OfflineMessage");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class IncompatibleProtocolVersion extends OfflineMessage_1.OfflineMessage {
    constructor() {
        // @ts-ignore
        super();
        this.protocolVersion = -1;
        this.serverId = -1;
    }
    getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_INCOMPATIBLE_PROTOCOL_VERSION;
    }
    encodePayload() {
        this.getStream().putByte(this.protocolVersion);
        this.putMagic();
        this.getStream().putLong(this.serverId);
    }
}
exports.IncompatibleProtocolVersion = IncompatibleProtocolVersion;
//# sourceMappingURL=IncompatibleProtocolVersion.js.map