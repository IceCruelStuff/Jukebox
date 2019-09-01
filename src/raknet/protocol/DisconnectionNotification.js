"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const MessageIdentifiers_1 = require("./MessageIdentifiers");
class DisconnectionNotification extends Packet_1.Packet {
    static getId() {
        return MessageIdentifiers_1.MessageIdentifiers.ID_DISCONNECTION_NOTIFICATION;
    }
}
exports.DisconnectionNotification = DisconnectionNotification;
//# sourceMappingURL=DisconnectionNotification.js.map