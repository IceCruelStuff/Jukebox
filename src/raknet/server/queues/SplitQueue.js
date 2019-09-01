"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SplitQueue extends Map {
    add(pk) {
        if (this.has(pk.splitID)) {
            let m = this.get(pk.splitID);
            m.set(pk.splitIndex, pk);
            this.set(pk.splitID, m);
        }
        else {
            let m = new Map([[pk.splitIndex, pk]]);
            this.set(pk.splitID, m);
        }
    }
    getSplitSize(splitID) {
        return this.get(splitID).size;
    }
    getSplits(splitID) {
        return this.get(splitID);
    }
    remove(splitID) {
        this.delete(splitID);
    }
    isEmpty() {
        return this.size === 0;
    }
}
exports.SplitQueue = SplitQueue;
//# sourceMappingURL=SplitQueue.js.map