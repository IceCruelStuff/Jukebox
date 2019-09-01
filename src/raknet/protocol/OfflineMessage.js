"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const RakNet_1 = require("../RakNet");
class OfflineMessage extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
    }
    getMagic() {
        this.magic = this.getBuffer().slice(this.getStream().offset, this.getStream().increaseOffset(16, true));
    }
    putMagic() {
        this.getStream().append(Buffer.from(RakNet_1.RakNet.MAGIC, "binary"));
    }
    validMagic() {
        return Buffer.from(this.magic).equals(Buffer.from(RakNet_1.RakNet.MAGIC, "binary"));
    }
}
exports.OfflineMessage = OfflineMessage;
//# sourceMappingURL=OfflineMessage.js.map