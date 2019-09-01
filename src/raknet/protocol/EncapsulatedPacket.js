"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryStream_1 = require("../../binarystream/BinaryStream");
const PacketReliability_1 = require("./PacketReliability");
class EncapsulatedPacket {
    constructor() {
        this.reliability = 0;
        this.hasSplit = false;
        this.lenght = 0;
        this.needACK = false;
    }
    static fromBinary(stream) {
        let packet = new EncapsulatedPacket();
        let flags = stream.getByte();
        packet.reliability = ((flags & 0xe0) >> 5);
        packet.hasSplit = (flags & 0x10) > 0;
        packet.length = Math.ceil(stream.getShort() / 8);
        if (packet.isReliable()) {
            packet.messageIndex = stream.getLTriad();
        }
        if (packet.isSequenced()) {
            packet.orderIndex = stream.getLTriad();
            packet.orderChannel = stream.getByte();
        }
        if (packet.hasSplit) {
            packet.splitCount = stream.getInt();
            packet.splitID = stream.getShort();
            packet.splitIndex = stream.getInt();
        }
        packet.stream = new BinaryStream_1.BinaryStream(stream.buffer.slice(stream.offset, stream.offset + packet.length));
        stream.offset += packet.length;
        return packet;
    }
    // static fromBinary(stream) {
    //     let packet = new EncapsulatedPacket();
    //     let reliability, flags, hasSplit, lenght;
    //
    //     flags = stream.getByte();
    //     packet.reliability = reliability = (flags & this.RELIABILITY_FLAGS) >> this.RELIABILITY_SHIFT;
    //     packet.hasSplit = hasSplit = (flags & this.SPLIT_FLAG) > 0;
    //
    //     packet.length = lenght = Math.ceil(stream.getShort() / 8);
    //     if (lenght === 0) {
    //         throw new Error("Encapsulated payload length cannot be zero");
    //     }
    //
    //     if (reliability > PacketReliability.UNRELIABLE) {
    //         if (PacketReliability.isReliable(reliability)) {
    //             packet.messageIndex = stream.getLTriad();
    //         }
    //
    //         if (PacketReliability.isSequenced(reliability)) {
    //             packet.sequenceIndex = stream.getLTriad();
    //         }
    //
    //         if (PacketReliability.isSequencedOrOrdered(reliability)) {
    //             packet.orderIndex = stream.getLTriad();
    //             packet.orderChannel = stream.getByte();
    //         }
    //     }
    //
    //     if (hasSplit) {
    //         packet.splitCount = stream.getInt();
    //         packet.splitID = stream.getShort();
    //         packet.splitIndex = stream.getInt();
    //     }
    //
    //     packet.stream = new BinaryStream(stream.buffer.slice(stream.offset, stream.offset + packet.length));
    //     stream.offset += packet.length;
    //
    //     return packet;
    // }
    isReliable() {
        return (this.reliability === PacketReliability_1.PacketReliability.RELIABLE ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_ORDERED ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_SEQUENCED ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_WITH_ACK_RECEIPT ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT);
    }
    isSequenced() {
        return (this.reliability === PacketReliability_1.PacketReliability.UNRELIABLE_SEQUENCED ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_ORDERED ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_SEQUENCED ||
            this.reliability === PacketReliability_1.PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT);
    }
    toBinary() {
        let stream = new BinaryStream_1.BinaryStream();
        stream.putByte((this.reliability << 5) | (this.hasSplit ? 0x10 : 0));
        stream.putShort(this.getBuffer().length << 3);
        if (this.isReliable()) {
            stream.putLTriad(this.messageIndex);
        }
        if (this.isSequenced()) {
            stream.putLTriad(this.orderIndex);
            stream.putByte(this.orderChannel);
        }
        if (this.hasSplit) {
            stream.putInt(this.splitCount);
            stream.putShort(this.splitID);
            stream.putInt(this.splitIndex);
        }
        stream.append(this.getBuffer());
        return stream.buffer.toString("hex");
    }
    getLength() {
        return 3 + this.getBuffer().length + (this.messageIndex !== null ? 3 : 0) + (this.orderIndex !== null ? 4 : 0) + (this.hasSplit ? 10 : 0);
    }
    getStream() {
        return this.stream;
    }
    getBuffer() {
        return this.stream.buffer;
    }
}
exports.EncapsulatedPacket = EncapsulatedPacket;
EncapsulatedPacket.RELIABILITY_SHIFT = 5;
EncapsulatedPacket.RELIABILITY_FLAGS = 0b111 << EncapsulatedPacket.RELIABILITY_SHIFT;
EncapsulatedPacket.SPLIT_FLAG = 0b00010000;
//# sourceMappingURL=EncapsulatedPacket.js.map