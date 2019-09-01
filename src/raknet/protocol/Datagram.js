"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("./Packet");
const BitFlags_1 = require("./BitFlags");
const EncapsulatedPacket_1 = require("./EncapsulatedPacket");
class Datagram extends Packet_1.Packet {
    constructor(stream) {
        super(stream);
        this.headerFlags = 0;
        this.packetPair = false;
        this.continuousSend = false;
        this.needsBAndAs = false;
        this.packets = [];
        this.sequenceNumber = 0;
    }
    encodeHeader() {
        if (this.packetPair === true) {
            this.headerFlags |= BitFlags_1.BitFlags.PACKET_PAIR;
        }
        if (this.continuousSend === true) {
            this.headerFlags |= BitFlags_1.BitFlags.CONTINUOUS_SEND;
        }
        if (this.needsBAndAs === true) {
            this.headerFlags |= BitFlags_1.BitFlags.NEEDS_B_AND_AS;
        }
        this.getStream().putByte(BitFlags_1.BitFlags.VALID | this.headerFlags);
    }
    encodePayload() {
        this.getStream().putLTriad(this.sequenceNumber);
        this.packets.forEach(packet => this.getStream().append(packet));
    }
    getLength() {
        let length = 4;
        this.packets.forEach(packet => {
            length += (packet instanceof EncapsulatedPacket_1.EncapsulatedPacket ? packet.getLength() : Buffer.byteLength(packet, "hex"));
        });
        return length;
    }
    decodeHeader() {
        this.headerFlags = this.getStream().getByte();
        this.packetPair = (this.headerFlags & BitFlags_1.BitFlags.PACKET_PAIR) > 0;
        this.continuousSend = (this.headerFlags & BitFlags_1.BitFlags.CONTINUOUS_SEND) > 0;
        this.needsBAndAs = (this.headerFlags & BitFlags_1.BitFlags.NEEDS_B_AND_AS) > 0;
    }
    decodePayload() {
        this.sequenceNumber = this.getStream().getLTriad();
        while (!this.getStream().feof()) {
            let packet = EncapsulatedPacket_1.EncapsulatedPacket.fromBinary(this.stream);
            if (packet.getStream().length === 0) {
                break;
            }
            this.packets.push(packet);
        }
    }
}
exports.Datagram = Datagram;
//# sourceMappingURL=Datagram.js.map