"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ACKQueue extends Map {
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
}
exports.ACKQueue = ACKQueue;
//# sourceMappingURL=ACKQueue.js.map