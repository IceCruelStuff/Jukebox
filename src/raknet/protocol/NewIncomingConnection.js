"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class NewIncomingConnection extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
        this.systemAddresses = [];
    }
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_NEW_INCOMING_CONNECTION;
    }
    encodePayload() { }
    decodePayload() {
        let addr = this.getStream().getAddress();
        this.address = addr.ip;
        this.port = addr.port;
        let stopOffset = this.getBuffer().length - 16;
        for (let i = 0; i < 20; ++i) {
            if (this.getStream().offset >= stopOffset) {
                this.systemAddresses.push(["0.0.0.0", 0, 4]);
            }
            else {
                let addr = this.getStream().getAddress();
                this.systemAddresses.push([addr.ip, addr.port, addr.version]);
            }
        }
        this.sendPingTime = this.getStream().getLong();
        this.sendPongTime = this.getStream().getLong();
    }
}
exports.NewIncomingConnection = NewIncomingConnection;
//# sourceMappingURL=NewIncomingConnection.js.map