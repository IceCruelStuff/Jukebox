"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class ConnectionRequestAccepted extends Packet_1.Packet {
    constructor() {
        super(...arguments);
        this.systemAddresses = [
            ["127.0.0.1", 0, 4]
        ];
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_CONNECTION_REQUEST_ACCEPTED;
    }
    encodePayload() {
        this.getStream()
            .putAddress(this.address, this.port, 4)
            .putShort(0);
        for (let i = 0; i < 20; ++i) {
            let addr = typeof this.systemAddresses[i] !== "undefined" ? this.systemAddresses[i] : ["0.0.0.0", 0, 4];
            this.getStream().putAddress(addr[0], addr[1], addr[2]);
        }
        this.getStream()
            .putLong(this.sendPingTime)
            .putLong(this.sendPongTime);
    }
}
exports.ConnectionRequestAccepted = ConnectionRequestAccepted;
//# sourceMappingURL=ConnectionRequestAccepted.js.map