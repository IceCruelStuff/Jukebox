"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmptySubChunk {
    isEmpty() {
        return true;
    }
    getBlockId() {
        return 0;
    }
    setBlock() {
        return false;
    }
    setBlockId() {
        return false;
    }
    getBlockData() {
        return 0;
    }
    setBlockData() {
        return false;
    }
    getBlockLight() {
        return 0;
    }
    setBlockLight() {
        return false;
    }
    getBlockSkyLight() {
        return 0;
    }
    setBlockSkyLight() {
        return false;
    }
    getHighestBlockId() {
        return 0;
    }
    getHighestBlockData() {
        return 0;
    }
    getHighestBlock() {
        return 0;
    }
    toBinary() {
        return Buffer.alloc(6145).fill(0x00);
    }
}
exports.EmptySubChunk = EmptySubChunk;
//# sourceMappingURL=EmptySubChunk.js.map