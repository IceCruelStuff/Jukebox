"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class ConnectedPing extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
        this.sendPingTime = -1;
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_CONNECTED_PING;
    }
    encodePayload() {
        this.getStream()
            .putLong(this.sendPingTime);
    }
    decodePayload() {
        this.sendPingTime = this.getStream().getLong();
    }
}
exports.ConnectedPing = ConnectedPing;
//# sourceMappingURL=ConnectedPing.js.map