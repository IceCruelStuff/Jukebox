import {ResourcePack} from "./ResourcePack";
import {Config} from "../utils/Config";
import {SimpleFileSystem} from "../utils/SimpleFileSystem";
import {ZippedResourcePack} from "./ZippedResourcePack";

export class ResourcePackManager {

    private server = {};
    private path = "";
    private config: Config;
    private forceResources = {};
    private resourcePacks = [];
    private uuidList = {};

    constructor(server, path){

        if(!SimpleFileSystem.dirExists(path)){
            SimpleFileSystem.mkdir(path);
        }else if(!SimpleFileSystem.isDir(path)){
            throw new Error("Resource packs path "+path+" exists and but is not a directory");
        }

        if(!SimpleFileSystem.fileExists(path + "resource_packs.json")){
            SimpleFileSystem.copy(server.getFilePath() + "pocketnode/resources/resource_packs.json", path + "resource_packs.json");
        }

        this.config = new Config(path + "resource_packs.json", Config.JSON, {});
        this.forceResources = Boolean(this.config.get("force", false));

        server.getLogger().info("Loading resource packs...");

        this.config.get("entries", []).forEach((pack, priority) => {
            try{
                let packPath = SimpleFileSystem.normalize(path + "/" + pack);
                if(SimpleFileSystem.fileExists(packPath)){
                    let newPack = null;
                    if(SimpleFileSystem.isDir(packPath)){
                        server.getLogger().warning("Skipped resource entry "+pack+" due to directory resource packs currently unsupported")
                    }else{
                        let newPack;
                        switch(SimpleFileSystem.getExtension(packPath)){
                            case "zip":
                            case "mcpack":
                                newPack = new ZippedResourcePack(packPath);
                                break;
                            default:
                                server.getLogger().warning("Skipped resource entry "+pack+" due to format not supported");
                                break;
                        }

                        // @ts-ignore
                        if(newPack instanceof ResourcePack){
                            this.resourcePacks.push(newPack);
                            this.uuidList[newPack.getPackId()] = newPack;
                        }
                    }
                }else{
                    server.getLogger().warning("Skipped resource entry "+pack+" due to file or directory not found");
                }
            }catch(e){
                server.getLogger().logError(e);
            }
        });

        server.getLogger().info("Successfully loaded "+this.resourcePacks.length+" resource packs");
    }

    resourcePacksRequired(){
        return this.forceResources;
    }

    getResourcePacks(){
        return this.resourcePacks;
    }

    getPackById(id){
        return this.uuidList[id] ? this.uuidList[id] : null;
    }

    getPackIdList(){
        return Object.keys(this.uuidList);
    }
}