"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryStream_1 = require("../../binarystream/BinaryStream");
class Packet {
    constructor(stream) {
        if (stream instanceof BinaryStream_1.BinaryStream) {
            this.stream = stream;
        }
        else {
            this.stream = new BinaryStream_1.BinaryStream();
        }
    }
    static getId() {
        return -1;
    }
    getId() {
        // @ts-ignore
        return this.constructor.getId();
    }
    encode() {
        this.encodeHeader();
        this.encodePayload();
    }
    encodeHeader() {
        this.getStream().putByte(this.getId());
    }
    encodePayload() { }
    decode() {
        this.decodeHeader();
        this.decodePayload();
    }
    decodeHeader() {
        this.getStream().getByte();
    }
    decodePayload() { }
    getStream() {
        return this.stream;
    }
    getBuffer() {
        return this.stream.buffer;
    }
}
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map