"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleFileSystem_1 = require("../utils/SimpleFileSystem");
const AdmZip = require("adm-zip");
const FileSystem = require("fs");
const Crypto = require("crypto");
class ZippedResourcePack {
    constructor(zipPath) {
        this.path = "";
        this.data = null;
        this.manifest = {
            header: undefined
        };
        this.sha256 = null;
        this.path = zipPath;
        if (!SimpleFileSystem_1.SimpleFileSystem.fileExists(zipPath)) {
            throw new Error("Couldn't open " + zipPath + ": file not found");
        }
        let zip;
        try {
            zip = new AdmZip(zipPath);
        }
        catch (e) {
            throw new Error("Error opening resource pack: " + zipPath);
        }
        let manifest;
        if ((manifest = zip.readFile("manifest.json")) === null) {
            throw new Error("Could not load resource pack from " + zipPath + ": manifest.json not found in the archive root");
        }
        this.data = SimpleFileSystem_1.SimpleFileSystem.readFile(zipPath);
        zip = null;
        manifest = JSON.parse(manifest.toString());
        if (!ZippedResourcePack.validManifest(manifest)) {
            throw new Error("Could not load resource pack from " + zipPath + ": manifest.json is invalid or incomplete");
        }
        this.manifest = manifest;
    }
    getPackName() {
        return this.manifest.header.name;
    }
    getPackVersion() {
        return this.manifest.header.version.join(".");
    }
    getPackId() {
        return this.manifest.header.uuid;
    }
    getPackSize() {
        return SimpleFileSystem_1.SimpleFileSystem.getFileSize(this.path);
    }
    getSha256(cached = true) {
        if (this.sha256 === null || !cached) {
            this.sha256 = this.HashFile("sha256", this.path);
        }
        return this.sha256;
    }
    getPackChunk(start, end) {
        return this.data.slice(start, start + end);
    }
    static validManifest(manifest) {
        if (!manifest.format_version || !manifest.header || !manifest.modules) {
            return false;
        }
        return manifest.header.description &&
            manifest.header.name &&
            manifest.header.uuid &&
            manifest.header.version &&
            manifest.header.version.length === 3;
    }
    HashFile(algo, path, buffer = false) {
        let hash = Crypto.createHash(algo);
        hash.update(FileSystem.readFileSync(path));
        return buffer === true ? hash.digest() : hash.digest("hex");
    }
}
exports.ZippedResourcePack = ZippedResourcePack;
//# sourceMappingURL=ZippedResourcePack.js.map