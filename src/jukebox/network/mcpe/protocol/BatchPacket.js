"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const BinaryStream_1 = require("../../../../binarystream/BinaryStream");
const Zlib = require("zlib");
class BatchPacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.payload = new BinaryStream_1.BinaryStream();
        this.compressionLevel = 7;
    }
    getId() {
        return 0xFE;
    }
    canBeBatched() {
        return false;
    }
    canBeSentBeforeLogin() {
        return true;
    }
    _decodeHeader() {
        let pid = this.getByte();
        if (pid !== this.getId()) {
            throw new Error("Received " + pid + " as the id, expected " + this.getId());
        }
        //TODO: assert
    }
    _decodePayload() {
        let data = this.getRemaining();
        this.payload = new BinaryStream_1.BinaryStream(Zlib.unzipSync(data));
    }
    _encodeHeader() {
        this.putByte(this.getId());
    }
    _encodePayload() {
        let buf = Zlib.deflateSync(this.payload.getBuffer(), { level: this.compressionLevel });
        this.append(buf);
    }
    addPacket(packet) {
        if (!packet.canBeBatched()) {
            throw new Error(packet.getName() + " can't be batched");
        }
        if (!packet.isEncoded) {
            packet.encode();
        }
        this.payload.putUnsignedVarInt(packet.length);
        this.payload.append(packet.getBuffer());
    }
    getPackets() {
        let pks = [];
        while (!this.payload.feof()) {
            pks.push(this.payload.get(this.payload.getUnsignedVarInt()));
        }
        return pks;
    }
    handle(session, logger) {
        if (this.payload.length === 0) {
            return false;
        }
        this.getPackets().forEach(buf => {
            let pk = session.raknetAdapter.packetPool.getPacket(buf[0]);
            if (pk instanceof DataPacket_1.DataPacket) {
                if (!pk.canBeBatched()) {
                    throw new Error("Received invalid " + pk.getName() + " inside BatchPacket");
                }
                pk.setBuffer(buf, 1);
                session.handleDataPacket(pk);
            }
            else {
                logger.debug("Got unhandled packet: 0x" + buf.slice(0, 1).toString("hex"));
            }
        });
        return true;
    }
}
exports.BatchPacket = BatchPacket;
//# sourceMappingURL=BatchPacket.js.map