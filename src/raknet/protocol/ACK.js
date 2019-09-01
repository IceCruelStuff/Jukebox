"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AcknowledgementPacket_1 = require("./AcknowledgementPacket");
class ACK extends AcknowledgementPacket_1.AcknowledgementPacket {
    constructor(stream) {
        super();
        if (stream) {
            this.stream = stream;
        }
    }
    static getId() {
        return 0xc0;
    }
}
exports.ACK = ACK;
//# sourceMappingURL=ACK.js.map