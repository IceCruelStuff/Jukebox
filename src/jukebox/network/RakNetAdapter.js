"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RakNetServer_1 = require("../../raknet/server/RakNetServer");
const Logger_1 = require("../logger/Logger");
const PacketPool_1 = require("./mcpe/protocol/PacketPool");
const PlayerList_1 = require("../utils/PlayerList");
const BatchPacket_1 = require("./mcpe/protocol/BatchPacket");
const Player_1 = require("../Player");
const Session_1 = require("../../raknet/server/Session");
class RakNetAdapter {
    constructor(server) {
        this.server = server;
        this.raknet = new RakNetServer_1.RakNetServer(server.getPort(), new Logger_1.Logger("RakNet").setDebugging(server.debuggingLevel));
        this.raknet.getServerName()
            .setServerId(server.getServerId())
            .setMotd("test")
            .setName("test")
            .setProtocol(361)
            .setVersion("1.12.0")
            .setOnlinePlayers(0)
            .setMaxPlayers(20)
            .setGamemode(0);
        this.packetPool = new PacketPool_1.PacketPool();
        this.logger = server.getLogger();
        this.players = new PlayerList_1.PlayerList();
    }
    /*setName(name: string): void{
        this.raknet.getServerName().setMotd(name);
    }*/
    sendPacket(player, packet, needACK, immediate) {
        if (this.players.hasPlayer(player)) {
            let identifier = this.players.getPlayerIdentifier(player);
            if (packet instanceof BatchPacket_1.BatchPacket) {
                let session;
                if ((session = this.raknet.getSessionManager().getSessionByIdentifier(identifier))) {
                    if (session instanceof Session_1.Session) {
                        session.queueConnectedPacketFromServer(packet, needACK, immediate);
                    }
                }
                return null;
            }
            else {
                this.server.batchPackets([player], [packet], true, immediate);
                this.logger.debugExtensive("Sending " + packet.getName() + ": " + packet.getBuffer());
            }
        }
    }
    tick() {
        this.raknet.getSessionManager().readOutgoingMessages().forEach(message => this.handleIncomingMessage(message.purpose, message.data));
        this.raknet.getSessionManager().getSessions().forEach(session => {
            let player = this.players.getPlayer(session.toString());
            session.packetBatches.getAllAndClear().forEach(packet => {
                let batch = new BatchPacket_1.BatchPacket();
                batch.setBuffer(packet.getStream().getBuffer());
                batch.decode();
                batch.handle(player.getSessionAdapter(), this.logger);
            });
        });
    }
    shutdown() {
        this.raknet.shutdown();
    }
    handleIncomingMessage(purpose, data) {
        let player;
        switch (purpose) {
            case "openSession":
                //TODO: call PlayerCreationEvent
                player = new Player_1.Player(this.server, data.clientId, data.ip, data.port);
                this.players.addPlayer(data.identifier, player);
                this.server.getPlayerList().addPlayer(data.identifier, player);
                break;
            case "closeSession":
                if (this.players.has(data.identifier)) {
                    player = this.players.get(data.identifier);
                    this.players.removePlayer(player);
                    player.close(player.getLeaveMessage(), data.reason);
                }
                break;
        }
    }
}
exports.RakNetAdapter = RakNetAdapter;
//# sourceMappingURL=RakNetAdapter.js.map