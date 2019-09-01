"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../utils/Config");
const SimpleFileSystem_1 = require("../utils/SimpleFileSystem");
const ZippedResourcePack_1 = require("./ZippedResourcePack");
class ResourcePackManager {
    constructor(server, path) {
        this.server = {};
        this.path = "";
        this.forceResources = {};
        this.resourcePacks = [];
        this.uuidList = {};
        if (!SimpleFileSystem_1.SimpleFileSystem.dirExists(path)) {
            SimpleFileSystem_1.SimpleFileSystem.mkdir(path);
        }
        else if (!SimpleFileSystem_1.SimpleFileSystem.isDir(path)) {
            throw new Error("Resource packs path " + path + " exists and but is not a directory");
        }
        if (!SimpleFileSystem_1.SimpleFileSystem.fileExists(path + "resource_packs.json")) {
            SimpleFileSystem_1.SimpleFileSystem.copy(server.getFilePath() + "pocketnode/resources/resource_packs.json", path + "resource_packs.json");
        }
        this.config = new Config_1.Config(path + "resource_packs.json", Config_1.Config.JSON, {});
        this.forceResources = Boolean(this.config.get("force", false));
        server.getLogger().info("Loading resource packs...");
        this.config.get("entries", []).forEach((pack, priority) => {
            try {
                let packPath = SimpleFileSystem_1.SimpleFileSystem.normalize(path + "/" + pack);
                if (SimpleFileSystem_1.SimpleFileSystem.fileExists(packPath)) {
                    let newPack = null;
                    if (SimpleFileSystem_1.SimpleFileSystem.isDir(packPath)) {
                        server.getLogger().warning("Skipped resource entry " + pack + " due to directory resource packs currently unsupported");
                    }
                    else {
                        let newPack;
                        switch (SimpleFileSystem_1.SimpleFileSystem.getExtension(packPath)) {
                            case "zip":
                            case "mcpack":
                                newPack = new ZippedResourcePack_1.ZippedResourcePack(packPath);
                                break;
                            default:
                                server.getLogger().warning("Skipped resource entry " + pack + " due to format not supported");
                                break;
                        }
                        // @ts-ignore
                        if (newPack instanceof ResourcePack) {
                            this.resourcePacks.push(newPack);
                            this.uuidList[newPack.getPackId()] = newPack;
                        }
                    }
                }
                else {
                    server.getLogger().warning("Skipped resource entry " + pack + " due to file or directory not found");
                }
            }
            catch (e) {
                server.getLogger().logError(e);
            }
        });
        server.getLogger().debug("Successfully loaded " + this.resourcePacks.length + " resource packs");
    }
    resourcePacksRequired() {
        return this.forceResources;
    }
    getResourcePacks() {
        return this.resourcePacks;
    }
    getPackById(id) {
        return this.uuidList[id] ? this.uuidList[id] : null;
    }
    getPackIdList() {
        return Object.keys(this.uuidList);
    }
}
exports.ResourcePackManager = ResourcePackManager;
//# sourceMappingURL=ResourcePackManager.js.map