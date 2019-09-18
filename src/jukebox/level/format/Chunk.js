"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmptySubChunk_1 = require("./EmptySubChunk");
const BinaryStream_1 = require("../../../binarystream/BinaryStream");
const SubChunk_1 = require("./SubChunk");
class Chunk {
    constructor(x, z, subChunks = new Map(), entities = new Map(), tiles = new Map(), biomes = [], heightMap = []) {
        this.height = 16;
        this.subChunks = new Map();
        this.lightPopulated = false;
        this.terrainPopulated = false;
        this.tiles = new Map();
        this.entities = new Map();
        this.biomes = [];
        this.heightMap = [];
        this.x = x;
        this.z = z;
        for (let y = 0; y < this.height; y++) {
            this.subChunks.set(y, subChunks.has(y) ? subChunks.get(y) : new EmptySubChunk_1.EmptySubChunk());
        }
        if (heightMap.length === 256) {
            this.heightMap = heightMap;
        }
        else {
            if (heightMap.length !== 0) {
                throw new Error("Wrong HeightMap value count, expected 256, got " + heightMap.length);
            }
            else {
                this.heightMap = new Array(256).fill(this.height * 16);
            }
        }
        if (biomes.length === 256) {
            this.biomes = biomes;
        }
        else {
            if (biomes.length !== 0) {
                throw new Error("Wrong Biomes value count, expected 256, got " + biomes.length);
            }
            else {
                this.biomes = new Array(256).fill(0x00);
            }
        }
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getZ() {
        return this.z;
    }
    setZ(z) {
        this.z = z;
    }
    getHeight() {
        return this.height;
    }
    setHeight(value = 256) {
        this.height = value;
    }
    getBiome(x, z) {
        return this.biomes.get(Chunk.getBiomeIndex(x, z));
    }
    setBiome(x, z, biome) {
        this.biomes.set(Chunk.getBiomeIndex(x, z), biome);
    }
    addEntity(entity) {
        if (!entity.isClosed()) {
            this.entities[entity.getId()] = entity;
        }
    }
    removeEntity(entity) {
        if (this.entities.has(entity.getRuntimeId())) {
            this.entities.delete(entity.getRuntimeId());
            return true;
        }
        return false;
    }
    addTile(tile) {
        if (!tile.isClosed()) {
            this.tiles.set(tile.getId(), tile);
            return true;
        }
        return false;
    }
    removeTile(tile) {
        if (this.tiles.has(tile.getId())) {
            this.tiles.delete(tile.getId());
            return true;
        }
        return false;
    }
    getBlockId(x, y, z) {
        return this.getSubChunk(y >> 4).getBlockId(x, y & 0x0f, z);
    }
    setBlock(x, y, z, blockId, meta) {
        if (this.getSubChunk(y >> 4, true).setBlock(x, y & 0x0f, z, blockId !== null ? (blockId & 0xff) : null, meta !== null ? (meta & 0x0f) : null)) {
            this.hasChanged = true;
            return true;
        }
        return false;
    }
    setBlockId(x, y, z, blockId) {
        if (this.getSubChunk(y >> 4, true).setBlockId(x, y & 0x0f, z, blockId)) {
            this.hasChanged = true;
        }
    }
    getBlockData(x, y, z) {
        return this.getSubChunk(y >> 4).getBlockData(x, y & 0x0f, z);
    }
    setBlockData(x, y, z, data) {
        return this.getSubChunk(y >> 4, true).setBlockData(x, y & 0x0f, z, data);
    }
    getBlockLight(x, y, z) {
        return this.getSubChunk(y >> 4).getBlockLight(x, y & 0x0f, z);
    }
    setBlockLight(x, y, z, level) {
        return this.getSubChunk(y >> 4, true).setBlockLight(x, y & 0x0f, z, level);
    }
    getBlockSkyLight(x, y, z) {
        return this.getSubChunk(y >> 4).getBlockSkyLight(x, y & 0x0f, z);
    }
    setBlockSkyLight(x, y, z, level) {
        return this.getSubChunk(y >> 4, true).setBlockSkyLight(x, y & 0x0f, z, level);
    }
    getSubChunk(y, genNew = false) {
        if (genNew && this.subChunks.get(y) instanceof EmptySubChunk_1.EmptySubChunk) {
            return this.subChunks.set(y, new SubChunk_1.SubChunk()).get(y);
        }
        return this.subChunks.get(y);
    }
    setSubChunk(y, subChunk = null, allowEmpty = false) {
        if (y < 0 || y >= this.height) {
            return false;
        }
        if (subChunk === null || (subChunk.isEmpty() && !allowEmpty)) {
            this.subChunks.set(y, new EmptySubChunk_1.EmptySubChunk());
        }
        else {
            this.subChunks.set(y, subChunk);
        }
        return true;
    }
    getSubChunks() {
        return this.subChunks;
    }
    getFullBlock(x, y, z) {
        return this.getSubChunk(y >> 4).getFullBlock(x, y & 0x0f, z);
    }
    getHeightMap(x, z) {
        return this.heightMap[Chunk.getHeightMapIndex(x, z)];
    }
    setHeightMap(x, z, value) {
        this.heightMap[Chunk.getHeightMapIndex(x, z)] = value;
    }
    recalculateHeightMap() {
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                this.setHeightMap(x, z, this.getHighestBlock(x, z) + 1);
            }
        }
    }
    getHighestSubChunk() {
        let y;
        for (y = this.subChunks.lenght; y >= 0; --y) {
            if (this.subChunks[y] instanceof EmptySubChunk_1.EmptySubChunk) {
                continue;
            }
            break;
            /*if(!this.subChunks.has(y)){
                continue;
            }
            if(this.subChunks.get(y).isEmpty()){
                continue;
            }
            return this.subChunks.get(y);*/
        }
        //return new EmptySubChunk();
        return y;
    }
    getHighestBlockId(x, z) {
        return this.getHighestSubChunk().getHighestBlockId(x, z);
    }
    getHighestBlockData(x, z) {
        return this.getHighestSubChunk().getHighestBlockData(x, z);
    }
    getHighestBlock(x, z) {
        let index = this.getHighestSubChunkIndex();
        if (index === -1) {
            return -1;
        }
        for (let y = index; y >= 0; --y) {
            let height = this.getSubChunk(y).getHighestBlock(x, z) | (y << 4);
            if (height !== -1) {
                return height;
            }
        }
        return -1;
    }
    getHighestSubChunkIndex() {
        let y;
        for (y = this.subChunks.size - 1; y >= 0; --y) {
            if (this.subChunks.get(y) instanceof EmptySubChunk_1.EmptySubChunk) {
                continue;
            }
            break;
        }
        return y;
    }
    getSubChunkSendCount() {
        return this.getHighestSubChunkIndex() + 1;
    }
    getFilledSubChunks() {
        //this.pruneEmptySubChunks();
        //return this.subChunks.size;
        return this.getHighestSubChunkIndex() + 1;
    }
    pruneEmptySubChunks() {
        for (let y = 15; y >= 0; y--) {
            if (!this.subChunks.has(y)) {
                continue;
            }
            if (!this.subChunks.get(y).isEmpty()) {
                return;
            }
            this.subChunks.delete(y);
        }
    }
    isLightPopulated() {
        return this.lightPopulated;
    }
    setLightPopulated(value = true) {
        this.lightPopulated = value;
    }
    isPopulated() {
        return this.terrainPopulated;
    }
    setPopulated(value = true) {
        this.terrainPopulated = value;
    }
    getEntities() {
        return this.entities;
    }
    getTiles() {
        return this.tiles;
    }
    toBinary() {
        let stream = new BinaryStream_1.BinaryStream();
        let subChunkCount = this.getFilledSubChunks();
        //stream.putByte(subChunkCount);
        for (let y = 0; y < subChunkCount; ++y) {
            stream.append(this.subChunks.get(y).toBinary());
        }
        //this.heightMap.forEach(v => stream.putLShort(v));
        this.biomes.forEach(v => stream.putByte(v));
        stream.putByte(0);
        //stream.putVarInt(0);
        return stream.getBuffer();
    }
    static getIdIndex(x, y, z) {
        return (x << 12) | (z << 8) | y;
    }
    static getBiomeIndex(x, z) {
        return (x << 4) | z;
    }
    static getHeightMapIndex(x, z) {
        return (z << 4) | x;
    }
}
exports.Chunk = Chunk;
//# sourceMappingURL=Chunk.js.map