import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class PlayStatusPacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.PLAY_STATUS_PACKET;
    }

    static readonly LOGIN_SUCCESS = 0;
    static readonly LOGIN_FAILED_CLIENT = 1;
    static readonly LOGIN_FAILED_SERVER = 2;
    static readonly PLAYER_SPAWN = 3;
    static readonly LOGIN_FAILED_INVALID_TENANT = 4;
    static readonly LOGIN_FAILED_VANILLA_EDU = 5;
    static readonly LOGIN_FAILED_EDU_VANILLA = 6;

    public status: number;

    canBeSentBeforeLogin(): boolean {
        return true;
    }

    _decodePayload() {
        this.status = this.getInt();
    }

    _encodePayload() {
        this.putInt(this.status);
    }

    handle(session): boolean {
        return session.handlePlayStatus(this);
    }
}