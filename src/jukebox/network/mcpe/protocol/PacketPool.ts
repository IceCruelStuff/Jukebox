import {LoginPacket} from "./LoginPacket";
import {PlayStatusPacket} from "./PlayStatusPacket";
import {ResourcePacksInfoPacket} from "./ResourcePacksInfoPacket";
import {ResourcePackClientResponsePacket} from "./ResourcePackClientResponsePacket";
import {ResourcePackDataInfoPacket} from "./ResourcePackDataInfoPacket";
import {ResourcePackStackPacket} from "./ResourcePackStackPacket";
import {StartGamePacket} from "./StartGamePacket";
import {SetLocalPlayerAsInitializedPacket} from "./SetLocalPlayerAsInitializedPacket";
import {LevelChunkPacket} from "./LevelChunkPacket";
import {RequestChunkRadiusPacket} from "./RequestChunkRadiusPacket";
import {ChunkRadiusUpdatedPacket} from "./ChunkRadiusUpdatedPacket";

export class PacketPool {

    public packetPool = new Map();

    constructor(){
        this.registerPackets();
    }

    registerPacket(packet){
        this.packetPool.set(packet.getId(), packet);
    }

    getPacket(id){
        return this.packetPool.has(id) ? new (this.packetPool.get(id))() : null;
    }

    isRegistered(id){
        return this.packetPool.has(id);
    }

    registerPackets() {
        this.registerPacket(LoginPacket);
        this.registerPacket(PlayStatusPacket);
        this.registerPacket(ResourcePacksInfoPacket);
        this.registerPacket(ResourcePackClientResponsePacket);
        this.registerPacket(ResourcePackDataInfoPacket);
        this.registerPacket(ResourcePackStackPacket);
        this.registerPacket(StartGamePacket);
        this.registerPacket(SetLocalPlayerAsInitializedPacket);
        this.registerPacket(LevelChunkPacket);
        this.registerPacket(RequestChunkRadiusPacket);
        this.registerPacket(ChunkRadiusUpdatedPacket);
    }
}