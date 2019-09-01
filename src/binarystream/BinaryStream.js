"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinaryStream {
    /**
     * @param buffer {Buffer|null}
     */
    constructor(buffer = null) {
        this.offset = 0;
        /** @type {Buffer} */
        this.buffer = Buffer.alloc(0);
        /** @type {number} */
        this.offset = 0;
        if (buffer !== null) {
            this.append(buffer);
            this.offset = 0;
        }
    }
    /*
     *******************************
     * Stream Management Functions *
     *******************************
    */
    /**
     * Read a set of bytes from the buffer
     * @param len {number}
     * @return {Buffer}
     */
    get(len) {
        return this.buffer.slice(this.offset, this.increaseOffset(len, true));
    }
    /**
     * Reset the buffer
     */
    reset() {
        this.buffer = Buffer.alloc(0);
        this.offset = 0;
    }
    /**
     * Set the buffer and/or offset
     * @param buffer {Buffer}
     * @param offset {number}
     */
    setBuffer(buffer = Buffer.alloc(0), offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
    }
    /**
     * Increase the stream's offset
     * @param v   {number}
     * @param ret {boolean}
     * @return {number}
     */
    increaseOffset(v, ret = false) {
        return (ret === true ? (this.offset += v) : (this.offset += v) - v);
    }
    /**
     * Append data to stream's buffer
     * @param buf {*}
     * @return {BinaryStream}
     */
    append(buf) {
        if (buf instanceof Buffer) {
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }
        else if (typeof buf === "string") {
            buf = Buffer.from(buf, "hex");
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }
        else if (Array.isArray(buf)) {
            buf = Buffer.from(buf);
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }
        return this;
    }
    /**
     * Get the read/write offset of the stream
     * @return {number}
     */
    getOffset() {
        return this.offset;
    }
    /**
     * Get the stream's buffer
     * @return {Buffer}
     */
    getBuffer() {
        return this.buffer;
    }
    /**
     * Shortcut for <BinaryStream>.buffer.length
     * @return {number}
     */
    get length() {
        return this.buffer.length;
    }
    /*
     *******************************
     * Buffer Management Functions *
     *******************************
    */
    /**
     * Get the amount of remaining bytes that can be read
     * @return {number}
     */
    getRemainingBytes() {
        return this.buffer.length - this.offset;
    }
    /**
     * Read the remaining amount of bytes
     */
    getRemaining() {
        let buf = this.buffer.slice(this.offset);
        this.offset = this.buffer.length;
        return buf;
    }
    /**
     * Reads a byte boolean
     * @return {boolean}
     */
    getBool() {
        return this.getByte() !== 0;
    }
    /**
     * Writes a byte boolean
     * @param v {boolean}
     * @return {BinaryStream}
     */
    putBool(v) {
        this.putByte(v === true ? 1 : 0);
        return this;
    }
    /**
     * Reads a unsigned/signed byte
     * @return {number}
     */
    getByte() {
        return this.getBuffer()[this.increaseOffset(1)];
    }
    /**
     * Writes a unsigned/signed byte
     * @param v {number}
     * @return {BinaryStream}
     */
    putByte(v) {
        this.append(Buffer.from([v & 0xff]));
        return this;
    }
    /**
     * Reads a 16-bit unsigned or signed big-endian number
     * @return {number}
     */
    getShort() {
        return this.buffer.readUInt16BE(this.increaseOffset(2));
    }
    /**
     * Writes a 16-bit unsigned big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putShort(v) {
        let buf = Buffer.alloc(2);
        buf.writeUInt16BE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 16-bit signed big-endian number
     * @return {number}
     */
    getSignedShort() {
        return this.buffer.readInt16BE(this.increaseOffset(2));
    }
    /**
     * Writes a 16-bit signed big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putSignedShort(v) {
        let buf = Buffer.alloc(2);
        buf.writeInt16BE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 16-bit unsigned little-endian number
     * @return {number}
     */
    getLShort() {
        return this.buffer.readUInt16LE(this.increaseOffset(2));
    }
    /**
     * Writes a 16-bit unsigned little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putLShort(v) {
        let buf = Buffer.alloc(2);
        buf.writeUInt16LE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 16-bit signed little-endian number
     * @return {number}
     */
    getSignedLShort() {
        return this.buffer.readInt16LE(this.increaseOffset(2));
    }
    /**
     * Writes a 16-bit signed little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putSignedLShort(v) {
        let buf = Buffer.alloc(2);
        buf.writeInt16LE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 3-byte big-endian number
     * @return {number}
     */
    getTriad() {
        return this.buffer.readUIntBE(this.increaseOffset(3), 3);
    }
    /**
     * Writes a 3-byte big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putTriad(v) {
        let buf = Buffer.alloc(3);
        buf.writeUIntBE(v, 0, 3);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 3-byte little-endian number
     * @return {number}
     */
    getLTriad() {
        return this.buffer.readUIntLE(this.increaseOffset(3), 3);
    }
    /**
     * Writes a 3-byte little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putLTriad(v) {
        let buf = Buffer.alloc(3);
        buf.writeUIntLE(v, 0, 3);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 32-bit signed big-endian number
     * @return {number}
     */
    getInt() {
        return this.buffer.readInt32BE(this.increaseOffset(4));
    }
    /**
     * Writes a 32-bit signed big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putInt(v) {
        let buf = Buffer.alloc(4);
        buf.writeInt32BE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * Reads a 32-bit signed little-endian number
     * @return {number}
     */
    getLInt() {
        return this.buffer.readInt32LE(this.increaseOffset(4));
    }
    /**
     * Writes a 32-bit signed little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    putLInt(v) {
        let buf = Buffer.alloc(4);
        buf.writeInt32LE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * @return {number}
     */
    getFloat() {
        return this.buffer.readFloatBE(this.increaseOffset(4));
    }
    // /**
    //  * @param accuracy {number}
    //  * @return {number}
    //  */
    // readRoundedFloat(accuracy: number){
    //     return Round(this.readFloat(), accuracy);
    // }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putFloat(v) {
        let buf = Buffer.alloc(8);
        let bytes = buf.writeFloatBE(v, 0);
        this.append(buf.slice(0, bytes));
        return this;
    }
    /**
     * @return {number}
     */
    getLFloat() {
        return this.buffer.readFloatLE(this.increaseOffset(4));
    }
    /**
     * @param accuracy {number}
     * @return {number}
     */
    getRoundedLFloat(accuracy) {
        // @ts-ignore
        return Math.round_php(this.getLFloat(), accuracy);
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putLFloat(v) {
        let buf = Buffer.alloc(8);
        let bytes = buf.writeFloatLE(v, 0);
        this.append(buf.slice(0, bytes));
        return this;
    }
    /**
     * @return {number}
     */
    getDouble() {
        return this.buffer.readDoubleBE(this.increaseOffset(8));
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putDouble(v) {
        let buf = Buffer.alloc(8);
        buf.writeDoubleBE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * @return {number}
     */
    getLDouble() {
        return this.buffer.readDoubleLE(this.increaseOffset(8));
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putLDouble(v) {
        let buf = Buffer.alloc(8);
        buf.writeDoubleLE(v, 0);
        this.append(buf);
        return this;
    }
    /**
     * @return {number}
     */
    getLong() {
        return (this.buffer.readUInt32BE(this.increaseOffset(4)) << 8) + this.buffer.readUInt32BE(this.increaseOffset(4));
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putLong(v) {
        let MAX_UINT32 = 0xFFFFFFFF;
        let buf = Buffer.alloc(8);
        buf.writeUInt32BE((~~(v / MAX_UINT32)), 0);
        buf.writeUInt32BE((v & MAX_UINT32), 4);
        this.append(buf);
        return this;
    }
    getLLong() {
        return this.buffer.readUInt32LE(0) + (this.buffer.readUInt32LE(4) << 8);
    }
    putLLong(v) {
        let MAX_UINT32 = 0xFFFFFFFF;
        let buf = Buffer.alloc(8);
        buf.writeUInt32LE((v & MAX_UINT32), 0);
        buf.writeUInt32LE((~~(v / MAX_UINT32)), 4);
        this.append(buf);
        return this;
    }
    /**
     * @return {number}
     */
    getUnsignedVarInt() {
        let value = 0;
        for (let i = 0; i <= 35; i += 7) {
            let b = this.getByte();
            value |= ((b & 0x7f) << i);
            if ((b & 0x80) === 0) {
                return value;
            }
        }
        return 0;
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putUnsignedVarInt(v) {
        let stream = new BinaryStream();
        for (let i = 0; i < 5; i++) {
            if ((v >> 7) !== 0) {
                stream.putByte(v | 0x80);
            }
            else {
                stream.putByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }
        this.append(stream.getBuffer());
        return this;
    }
    /**
     * @return {number}
     */
    getVarInt() {
        let raw = this.getUnsignedVarInt();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putVarInt(v) {
        v <<= 32 >> 32;
        return this.putUnsignedVarInt((v << 1) ^ (v >> 31));
    }
    /**
     * @return {number}
     */
    getUnsignedVarLong() {
        let value = 0;
        for (let i = 0; i <= 63; i += 7) {
            let b = this.getByte();
            value |= ((b & 0x7f) << i);
            if ((b & 0x80) === 0) {
                return value;
            }
        }
        return 0;
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putUnsignedVarLong(v) {
        for (let i = 0; i < 10; i++) {
            if ((v >> 7) !== 0) {
                this.putByte(v | 0x80);
            }
            else {
                this.putByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }
        return this;
    }
    /**
     * @return {number}
     */
    getVarLong() {
        let raw = this.getUnsignedVarLong();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }
    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    putVarLong(v) {
        return this.putUnsignedVarLong((v << 1) ^ (v >> 63));
    }
    // /**
    //  * @return {boolean}
    //  */
    // feof(){
    //     return typeof this.getBuffer()[this.offset] === "undefined";
    // }
    /**
     * Reads address from buffer
     * @return {{ip: string, port: number, version: number}}
     */
    getAddress() {
        let addr, port;
        let version = this.getByte();
        switch (version) {
            default:
            case 4:
                addr = [];
                for (let i = 0; i < 4; i++) {
                    addr.push(this.getByte() & 0xff);
                }
                addr = addr.join(".");
                port = this.getShort();
                break;
            // add ipv6 support
        }
        return { ip: addr, port: port, version: version };
    }
    /**
     * Writes address to buffer
     * @param addr    {string}
     * @param port    {number}
     * @param version {string|number}
     * @return {BinaryStream}
     */
    putAddress(addr, port, version) {
        this.putByte(version);
        switch (version) {
            default:
            case 4:
                addr.split(".", 4).forEach(b => this.putByte((Number(b)) & 0xff));
                this.putShort(port);
                break;
        }
        return this;
    }
    /**
     * @param v {string}
     * @return {BinaryStream}
     */
    putString(v) {
        this.append(Buffer.from(v, "utf8"));
        return this;
    }
    flip() {
        this.offset = 0;
        return this;
    }
    feof() {
        return typeof this.getBuffer()[this.offset] === "undefined";
    }
    /**
     * @param spaces {boolean}
     */
    toHex(spaces = false) {
        let hex = this.buffer.toString("hex");
        return spaces ? hex.split(/(..)/).filter(v => v !== "").join(" ") : hex;
    }
}
exports.BinaryStream = BinaryStream;
//# sourceMappingURL=BinaryStream.js.map