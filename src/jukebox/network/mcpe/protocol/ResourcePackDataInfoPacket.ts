import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";
import {ResourcePackType} from "./types/ResourcePackType";

export class ResourcePackDataInfoPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.RESOURCE_PACK_DATA_PACKET;
    }

    public packId: string;
    public maxChunkSize: number;
    public chunkCount: number;
    public compressedPackSize: number;
    public sha256: string;
    public isPremium: boolean = false;
    public packType = ResourcePackType.RESOURCES;

    _decodePayload() {
        this.packId = this.getString();
        this.maxChunkSize = this.getLInt();
        this.chunkCount = this.getLInt();
        this.compressedPackSize = this.getLLong();
        this.sha256 = this.getString();
        this.isPremium = this.getBool();
        this.packType = this.getByte();
    }

    _encodePayload() {
        this.putString(this.packId);
        this.putLInt(this.maxChunkSize);
        this.putLInt(this.chunkCount);
        this.putLLong(this.compressedPackSize);
        this.putString(this.sha256);
        this.putBool(this.isPremium);
        this.putByte(this.packType);
    }

    handle(session): boolean {
        return session.handleResourcePackDataInfo(this);
    }
}