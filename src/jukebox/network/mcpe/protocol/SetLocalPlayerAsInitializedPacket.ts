import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class SetLocalPlayerAsInitializedPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.SET_LOCAL_PLAYER_AS_INITIALIZED_PACKET;
    }

    public entityRuntimeId: number;

    _decodePayload() {
        this.entityRuntimeId = this.getEntityRuntimeId();
    }

    _encodePayload() {
        this.putEntityRuntimeId(this.entityRuntimeId);
    }

    handle(session): boolean {
        return session.handleSetLocalPlayerAsInitialized(this);
    }
}