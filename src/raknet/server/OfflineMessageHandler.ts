import {SessionManager} from "./SessionManager";
import {OfflineMessage} from "../protocol/OfflineMessage";
import {UnconnectedPing} from "../protocol/UnconnectedPing";
import {RakNet} from "../RakNet";
import {UnconnectedPong} from "../protocol/UnconnectedPong";
import {OpenConnectionRequest1} from "../protocol/OpenConnectionRequest1";
import {IncompatibleProtocolVersion} from "../protocol/IncompatibleProtocolVersion";
import {OpenConnectionRequest2} from "../protocol/OpenConnectionRequest2";
import {OpenConnectionReply2} from "../protocol/OpenConnectionReply2";
import {OpenConnectionReply1} from "../protocol/OpenConnectionReply1";

export class OfflineMessageHandler {

    public sessionManager: SessionManager;

    constructor(manager){
        this.sessionManager = manager;
    }

    handle(packet, address, port){
        if(!(packet instanceof OfflineMessage)){
            throw new Error("Expected OfflineMessage, got " + (packet.name ? packet.name : packet));
        }

        let pk;
        switch(packet.getId()){
            case UnconnectedPing.getId():
                pk = new UnconnectedPong();
                pk.serverName = this.sessionManager.getServerName().toString();
                pk.serverId = this.sessionManager.getId();
                // @ts-ignore
                pk.pingId = packet.pingId;
                this.sessionManager.sendPacket(pk, address, port);
                return true;

            case OpenConnectionRequest1.getId():
                // @ts-ignore
                if(packet.protocolVersion !== RakNet.PROTOCOL){
                    pk = new IncompatibleProtocolVersion();
                    pk.protocolVersion = RakNet.PROTOCOL;
                    pk.serverId = this.sessionManager.getId();
                    // @ts-ignore
                    this.sessionManager.getLogger().debug(address + ":" + port + " couldn't connect because they had protocol " + packet.protocolVersion + ", while RakNet is running on protocol " + RakNet.PROTOCOL);
                }else{
                    // @ts-ignore
                    pk = new OpenConnectionReply1();
                    pk.serverId = this.sessionManager.getId();
                    // @ts-ignore
                    pk.mtuSize = packet.mtuSize;
                }
                this.sessionManager.sendPacket(pk, address, port);
                return true;

            case OpenConnectionRequest2.getId():
                if(true || packet.serverPort === this.sessionManager.getPort()){
                    // @ts-ignore
                    let mtuSize = Math.min(Math.abs(packet.mtuSize), 1464);
                    pk = new OpenConnectionReply2();
                    pk.serverId = this.sessionManager.getId();
                    pk.clientAddress = address;
                    pk.clientPort = port;
                    pk.mtuSize = mtuSize;
                    this.sessionManager.sendPacket(pk, address, port);
                    // @ts-ignore
                    let session = this.sessionManager.createSession(address, port, packet.clientId, mtuSize);
                    this.sessionManager.getLogger().debug("Created session for " + session);
                }else{
                    this.sessionManager.getLogger().debug("Not creating session for " + address + ":" + port + " due to mismatched port, expected " + this.sessionManager.getPort() + ", got " + packet.serverPort);
                }
                return true;
        }

        return false;
    }
}