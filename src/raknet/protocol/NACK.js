"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AcknowledgementPacket_1 = require("./AcknowledgementPacket");
class NACK extends AcknowledgementPacket_1.AcknowledgementPacket {
    constructor(stream) {
        super(stream);
    }
    getId() {
        return 0xA0;
    }
}
exports.NACK = NACK;
//# sourceMappingURL=NACK.js.map