"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PacketBatchHolder extends Map {
    add(v) {
        this.set(v, true);
    }
    remove(v) {
        this.delete(v);
    }
    getAll() {
        return Array.from(this.keys());
    }
    isEmpty() {
        return this.size === 0;
    }
    getAllAndClear() {
        let packets = this.getAll();
        this.clear();
        return packets;
    }
}
exports.PacketBatchHolder = PacketBatchHolder;
//# sourceMappingURL=PacketBatchHolder.js.map