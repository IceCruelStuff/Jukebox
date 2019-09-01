"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class ConnectedPong extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_CONNECTED_PONG;
    }
    encodePayload() {
        this.getStream()
            .putLong(this.sendPingTime)
            .putLong(this.sendPongTime);
    }
    decodePayload() {
        this.sendPingTime = this.getStream().getLong();
        this.sendPongTime = this.getStream().getLong();
    }
}
exports.ConnectedPong = ConnectedPong;
//# sourceMappingURL=ConnectedPong.js.map