"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const BinaryStream_1 = require("../../binarystream/BinaryStream");
class AcknowledgementPacket extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
        this.packets = [];
    }
    encodePayload() {
        let payload = new BinaryStream_1.BinaryStream();
        this.packets = this.packets.sort((x, y) => {
            return x - y;
        });
        let count = this.packets.length;
        let records = 0;
        if (count > 0) {
            let pointer = 0;
            let start = this.packets[0];
            let last = this.packets[0];
            while (pointer + 1 < count) {
                let current = this.packets[pointer++];
                let diff = current - last;
                if (diff === 1) {
                    last = current;
                }
                else if (diff > 1) {
                    if (start === last) {
                        payload
                            .putBool(true)
                            .putLTriad(start);
                        start = last = current;
                    }
                    else {
                        payload
                            .putBool(false)
                            .putLTriad(start)
                            .putLTriad(last);
                        start = last = current;
                    }
                    records++;
                }
            }
            if (start === last) {
                payload
                    .putBool(true)
                    .putLTriad(start);
            }
            else {
                payload
                    .putBool(false)
                    .putLTriad(start)
                    .putLTriad(last);
            }
            records++;
        }
        this.getStream()
            .putShort(records)
            .append(payload.getBuffer());
    }
    decodePayload() {
        let count = this.getStream().getShort();
        this.packets = [];
        let cnt = 0;
        for (let i = 0; i < count && !this.getStream().feof() && cnt < 4096; ++i) {
            if (this.getStream().getByte() === 0) {
                let start = this.getStream().getLTriad();
                let end = this.getStream().getLTriad();
                if ((end - start) > 512) {
                    end = start + 512;
                }
                for (let c = start; c <= end; ++c) {
                    this.packets[cnt++] = c;
                }
            }
            else {
                this.packets[cnt++] = this.getStream().getLTriad();
            }
        }
    }
}
exports.AcknowledgementPacket = AcknowledgementPacket;
//# sourceMappingURL=AcknowledgementPacket.js.map