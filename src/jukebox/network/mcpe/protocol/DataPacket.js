"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkBinaryStream_1 = require("../NetworkBinaryStream");
class DataPacket extends NetworkBinaryStream_1.NetworkBinaryStream {
    constructor() {
        super();
        this.isEncoded = false;
    }
    static getId() {
        return 0;
    }
    getId() {
        // @ts-ignore
        return this.constructor.getId();
    }
    getName() {
        return this.constructor.name;
    }
    canBeBatched() {
        return true;
    }
    canBeSentBeforeLogin() {
        return false;
    }
    mayHaveUnreadBytes() {
        return false;
    }
    clean() {
        this.isEncoded = false;
        super.reset();
    }
    decode() {
        this.offset = 0;
        this._decodeHeader();
        this._decodePayload();
    }
    _decodeHeader() {
        let pid = this.getUnsignedVarInt();
        if (pid !== this.getId()) {
            console.log(`Expected " . ${this.getId()} . " for packet ID, got ${pid}`);
        }
    }
    _decodePayload() { }
    encode() {
        this.reset();
        this._encodeHeader();
        this._encodePayload();
        this.isEncoded = true;
    }
    _encodeHeader() {
        this.putUnsignedVarInt(this.getId());
    }
    _encodePayload() { }
    getBuffer() {
        return this.buffer;
    }
    handle(session) {
        return false;
    }
}
exports.DataPacket = DataPacket;
//# sourceMappingURL=DataPacket.js.map