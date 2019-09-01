import {RakNetServer} from "../../raknet/server/RakNetServer";
import {JukeboxServer} from "../JukeboxServer";
import {Logger} from "../logger/Logger";
import {PacketPool} from "./mcpe/protocol/PacketPool";
import {PlayerList} from "../utils/PlayerList";
import {BatchPacket} from "./mcpe/protocol/BatchPacket";
import {Player} from "../Player";

export class RakNetAdapter {

    private readonly server: JukeboxServer;
    private readonly raknet: RakNetServer;
    private packetPool: PacketPool;
    private readonly logger: Logger;
    private players: PlayerList;

    constructor(server: JukeboxServer){
        this.server = server;
        this.raknet = new RakNetServer(server.getPort(), new Logger("RakNet").setDebugging(server.debuggingLevel));
        this.raknet.getServerName()
            .setServerId(server.getServerId())
            .setMotd("test")
            .setName("test")
            .setProtocol(361)
            .setVersion("1.12.0")
            .setOnlinePlayers(0)
            .setMaxPlayers(20)
            .setGamemode(0);
        this.packetPool = new PacketPool();
        this.logger = server.getLogger();
        this.players = new PlayerList();
    }

    /*setName(name: string): void{
        this.raknet.getServerName().setMotd(name);
    }*/

    sendPacket(player, packet, needACK, immediate){
        if(this.players.hasPlayer(player)){
            let identifier = this.players.getPlayerIdentifier(player);

            if(packet instanceof BatchPacket){
                let session;
                if((session = this.raknet.getSessionManager().getSessionByIdentifier(identifier))){
                    session.queueConnectedPacketFromServer(packet, needACK, immediate);
                }
                return null;
            }else{
                this.server.batchPackets([player], [packet], true, immediate);
                this.logger.debugExtensive("Sending "+packet.getName()+": " + packet.getBuffer());
            }
        }
    }

    tick(){
        this.raknet.getSessionManager().readOutgoingMessages().forEach(message => this.handleIncomingMessage(message.purpose, message.data));

        this.raknet.getSessionManager().getSessions().forEach(session => {
            let player = this.players.getPlayer(session.toString());

            session.packetBatches.getAllAndClear().forEach(packet => {
                let batch = new BatchPacket();
                batch.setBuffer(packet.getStream().getBuffer());
                batch.decode();
                batch.handle(player.getSessionAdapter(), this.logger);
            });
        });
    }

    shutdown(): void{
        this.raknet.shutdown();
    }

    private handleIncomingMessage(purpose, data): void{
        let player;
        switch(purpose){
            case "openSession":
                //TODO: call PlayerCreationEvent
                player = new Player(this.server, data.clientId, data.ip, data.port);
                this.players.addPlayer(data.identifier, player);
                this.server.getPlayerList().addPlayer(data.identifier, player);
                break;

            case "closeSession":
                if(this.players.has(data.identifier)){
                    player = this.players.get(data.identifier);
                    this.players.removePlayer(player);
                    player.close(player.getLeaveMessage(), data.reason);
                }
                break;
        }
    }
}