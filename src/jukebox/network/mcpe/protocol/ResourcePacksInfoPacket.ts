import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";
import {ResourcePack} from "../../../resourcepacks/ResourcePack";

export class ResourcePacksInfoPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.RESOURCE_PACKS_PACKET;
    }

    public mustAccept: boolean;
    public hasScripts: boolean;
    public behaviorPackEntries: ResourcePack[] = [];
    public resourcePackEntries: ResourcePack[] = [];

    _decodePayload() {
        this.mustAccept = this.getBool();
        this.hasScripts = this.getBool();
        let behaviorPackCount = this.getLShort();
        while (behaviorPackCount-- > 0){
            this.getString();
            this.getString();
            this.getLLong();
            this.getString();
            this.getString();
            this.getString();
            this.getBool();
        }

        let resourcePackCount = this.getLShort();
        while (resourcePackCount-- > 0){
            this.getString();
            this.getString();
            this.getLLong();
            this.getString();
            this.getString();
            this.getString();
            this.getBool();
        }
    }

    _encodePayload() {
        this.putBool(this.mustAccept);
        this.putBool(this.hasScripts);
        this.putLShort(this.behaviorPackEntries.length);
        this.behaviorPackEntries.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putLLong(entry.getPackSize());
            this.putString("");
            this.putString("");
            this.putString("");
            this.putBool(false);
        });
        this.putLShort(this.resourcePackEntries.length);
        this.resourcePackEntries.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putLLong(entry.getPackSize());
            this.putString("");
            this.putString("");
            this.putString("");
            this.putBool(false);
        });
    }
}