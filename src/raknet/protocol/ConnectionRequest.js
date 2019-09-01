"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class ConnectionRequest extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_CONNECTION_REQUEST;
    }
    encodePayload() {
        this.getStream()
            .putLong(this.clientId)
            .putLong(this.sendPingTime)
            .putBool(this.useSecurity);
    }
    decodePayload() {
        this.clientId = this.getStream().getLong();
        this.sendPingTime = this.getStream().getLong();
        this.useSecurity = this.getStream().getBool();
    }
}
exports.ConnectionRequest = ConnectionRequest;
//# sourceMappingURL=ConnectionRequest.js.map