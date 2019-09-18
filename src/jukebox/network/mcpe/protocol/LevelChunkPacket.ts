import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class LevelChunkPacket extends DataPacket{
    
    static getId(): any {
        return ProtocolInfo.LEVEL_CHUNK_PACKET;
    }
    
    public chunkX: number;
    public chunkZ: number;
    public subChunkCount: number;
    public cacheEnabled: boolean;
    public usedBlobHashes: any[];
    public extraPayload: string;
    
    _decodePayload() {
        this.chunkX = this.getVarInt();
        this.chunkZ = this.getVarInt();
        this.subChunkCount = this.getUnsignedVarInt();
        this.cacheEnabled = this.getBool();
        if (this.cacheEnabled){
            for (let i = 0, count = this.getUnsignedVarInt(); i < count; ++i){
                this.usedBlobHashes.push(this.getLLong());
            }
        }
        this.extraPayload = this.getString();
    }

    _encodePayload(){
        this.putVarInt(this.chunkX);
        this.putVarInt(this.chunkZ);
        this.putUnsignedVarInt(this.subChunkCount);
        this.putBool(this.cacheEnabled);

        if(this.cacheEnabled){
            this.putUnsignedVarInt(this.usedBlobHashes.length);
            this.usedBlobHashes.forEach(hash => {
                this.putLLong(hash);
            });
        }
        this.putString(this.extraPayload);
    }
}