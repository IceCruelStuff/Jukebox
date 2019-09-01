"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OfflineMessage_1 = require("../protocol/OfflineMessage");
const UnconnectedPing_1 = require("../protocol/UnconnectedPing");
const RakNet_1 = require("../RakNet");
const UnconnectedPong_1 = require("../protocol/UnconnectedPong");
const OpenConnectionRequest1_1 = require("../protocol/OpenConnectionRequest1");
const IncompatibleProtocolVersion_1 = require("../protocol/IncompatibleProtocolVersion");
const OpenConnectionRequest2_1 = require("../protocol/OpenConnectionRequest2");
const OpenConnectionReply2_1 = require("../protocol/OpenConnectionReply2");
const OpenConnectionReply1_1 = require("../protocol/OpenConnectionReply1");
class OfflineMessageHandler {
    constructor(manager) {
        this.sessionManager = manager;
    }
    handle(packet, address, port) {
        if (!(packet instanceof OfflineMessage_1.OfflineMessage)) {
            throw new Error("Expected OfflineMessage, got " + (packet.name ? packet.name : packet));
        }
        let pk;
        switch (packet.getId()) {
            case UnconnectedPing_1.UnconnectedPing.getId():
                pk = new UnconnectedPong_1.UnconnectedPong();
                pk.serverName = this.sessionManager.getServerName().toString();
                pk.serverId = this.sessionManager.getId();
                // @ts-ignore
                pk.pingId = packet.pingId;
                this.sessionManager.sendPacket(pk, address, port);
                return true;
            case OpenConnectionRequest1_1.OpenConnectionRequest1.getId():
                // @ts-ignore
                if (packet.protocolVersion !== RakNet_1.RakNet.PROTOCOL) {
                    pk = new IncompatibleProtocolVersion_1.IncompatibleProtocolVersion();
                    pk.protocolVersion = RakNet_1.RakNet.PROTOCOL;
                    pk.serverId = this.sessionManager.getId();
                    // @ts-ignore
                    this.sessionManager.getLogger().debug(address + ":" + port + " couldn't connect because they had protocol " + packet.protocolVersion + ", while RakNet is running on protocol " + RakNet_1.RakNet.PROTOCOL);
                }
                else {
                    // @ts-ignore
                    pk = new OpenConnectionReply1_1.OpenConnectionReply1();
                    pk.serverId = this.sessionManager.getId();
                    // @ts-ignore
                    pk.mtuSize = packet.mtuSize;
                }
                this.sessionManager.sendPacket(pk, address, port);
                return true;
            case OpenConnectionRequest2_1.OpenConnectionRequest2.getId():
                if (true || packet.serverPort === this.sessionManager.getPort()) {
                    // @ts-ignore
                    let mtuSize = Math.min(Math.abs(packet.mtuSize), 1464);
                    pk = new OpenConnectionReply2_1.OpenConnectionReply2();
                    pk.serverId = this.sessionManager.getId();
                    pk.clientAddress = address;
                    pk.clientPort = port;
                    pk.mtuSize = mtuSize;
                    this.sessionManager.sendPacket(pk, address, port);
                    // @ts-ignore
                    let session = this.sessionManager.createSession(address, port, packet.clientId, mtuSize);
                    this.sessionManager.getLogger().debug("Created session for " + session);
                }
                else {
                    this.sessionManager.getLogger().debug("Not creating session for " + address + ":" + port + " due to mismatched port, expected " + this.sessionManager.getPort() + ", got " + packet.serverPort);
                }
                return true;
        }
        return false;
    }
}
exports.OfflineMessageHandler = OfflineMessageHandler;
//# sourceMappingURL=OfflineMessageHandler.js.map