import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";

export class TextPacket extends DataPacket{

    static getId(){
        return ProtocolInfo.TEXT_PACKET;
    }

    static readonly TYPE_RAW: number = 0;
    static readonly TYPE_CHAT: number = 1;
    static readonly TYPE_TRANSLATION: number = 2;
    static readonly TYPE_POPUP: number = 3;
    static readonly TYPE_JUKEBOX_POPUP: number = 4;
    static readonly TYPE_TIP: number = 5;
    static readonly TYPE_SYSTEM: number = 6;
    static readonly TYPE_WHISPER: number = 7;
    static readonly TYPE_ANNOUNCEMENT: number = 8;
    static readonly TYPE_JSON: number = 9;

    public type: number;
    public needsTranslation: boolean = false;
    public sourceName: string;
    public message: string;
    public parameters: string[] = [];
    public xboxUserId: string = "";
    public platformChatId: string = "";

    _decodePayload() {
        this.type = this.getByte();
        this.needsTranslation = this.getBool();
        switch (this.type) {
            case TextPacket.TYPE_CHAT:
            case TextPacket.TYPE_WHISPER:
            case TextPacket.TYPE_ANNOUNCEMENT:
                this.sourceName = this.getString();

            case TextPacket.TYPE_RAW:
            case TextPacket.TYPE_TIP:
            case TextPacket.TYPE_SYSTEM:
            case TextPacket.TYPE_JSON:
                this.message = this.getString();
                break;

            case TextPacket.TYPE_TRANSLATION:
            case TextPacket.TYPE_POPUP:
            case TextPacket.TYPE_JUKEBOX_POPUP:
                this.message = this.getString();
                let [count, i] = [this.getUnsignedVarInt(), 0];
                for (i; i < count; i++){
                    this.parameters.push(this.getString());
                }
                break;
        }

        this.xboxUserId = this.getString();
        this.platformChatId = this.getString();
    }

    _encodePayload() {
        this.putByte(this.type);
        this.putBool(this.needsTranslation);
        switch (this.type) {
            case TextPacket.TYPE_CHAT:
            case TextPacket.TYPE_WHISPER:
            case TextPacket.TYPE_ANNOUNCEMENT:
                this.putString(this.sourceName);
            case TextPacket.TYPE_RAW:
            case TextPacket.TYPE_TIP:
            case TextPacket.TYPE_SYSTEM:
            case TextPacket.TYPE_JSON:
                this.putString(this.message);
                break;

            case TextPacket.TYPE_TRANSLATION:
            case TextPacket.TYPE_POPUP:
            case TextPacket.TYPE_JUKEBOX_POPUP:
                this.putString(this.message);
                this.putUnsignedVarInt(this.parameters.length);
                this.parameters.forEach(p => {
                   this.putString(p);
                });
                break;
        }

        this.putString(this.xboxUserId);
        this.putString(this.platformChatId);
    }

    handle(session): boolean {
        return session.handleText(this);
    }
}