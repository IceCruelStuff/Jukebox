import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";
import {ResourcePack} from "../../../resourcepacks/ResourcePack";

export class ResourcePackStackPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.RESOURCE_PACK_STACK_PACKET;
    }

    public mustAccept: boolean = false;

    public behaviorPackStack: ResourcePack[] = [];
    public resourcePackStack: ResourcePack[] = [];

    public isExperimental: boolean = false;

    _decodePayload() {
        this.mustAccept = this.getBool();
        let behaviorPackCount = this.getUnsignedVarInt();
        while (behaviorPackCount-- > 0) {
            this.getString();
            this.getString();
            this.getString();
        }

        let resourcePackCount = this.getUnsignedVarInt();
        while (resourcePackCount-- > 0) {
            this.getString();
            this.getString();
            this.getString();
        }

        this.isExperimental = this.getBool();
    }

    _encodePayload() {
        this.putBool(this.mustAccept);

        this.putUnsignedVarInt(this.behaviorPackStack.length);
        this.behaviorPackStack.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putString("");
        });

        this.putUnsignedVarInt(this.resourcePackStack.length);
        this.resourcePackStack.forEach(entry => {
            this.putString(entry.getPackId());
            this.putString(entry.getPackVersion());
            this.putString("");
        });

        this.putBool(this.isExperimental);
    }

    handle(session): boolean {
        return session.handleResourcePackStack(this);
    }
}