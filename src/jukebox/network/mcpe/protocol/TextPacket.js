"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
class TextPacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.needsTranslation = false;
        this.parameters = [];
        this.xboxUserId = "";
        this.platformChatId = "";
    }
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.TEXT_PACKET;
    }
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
                for (i; i < count; i++) {
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
    handle(session) {
        return session.handleText(this);
    }
}
exports.TextPacket = TextPacket;
TextPacket.TYPE_RAW = 0;
TextPacket.TYPE_CHAT = 1;
TextPacket.TYPE_TRANSLATION = 2;
TextPacket.TYPE_POPUP = 3;
TextPacket.TYPE_JUKEBOX_POPUP = 4;
TextPacket.TYPE_TIP = 5;
TextPacket.TYPE_SYSTEM = 6;
TextPacket.TYPE_WHISPER = 7;
TextPacket.TYPE_ANNOUNCEMENT = 8;
TextPacket.TYPE_JSON = 9;
//# sourceMappingURL=TextPacket.js.map