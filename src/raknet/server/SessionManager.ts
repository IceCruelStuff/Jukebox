import {PacketPool} from "./PacketPool";
import {OfflineMessageHandler} from "./OfflineMessageHandler";
import {BinaryStream} from "../../binarystream/BinaryStream";
import {OfflineMessage} from "../protocol/OfflineMessage";
import {BitFlags} from "../protocol/BitFlags";
import {ACK} from "../protocol/ACK";
import {NACK} from "../protocol/NACK";
import {Datagram} from "../protocol/Datagram";
import {Session} from "./Session";
import {RakNetServer} from "./RakNetServer";
import {UDPServerSocket} from "./UDPServerSocket";
import {Logger} from "../../jukebox/logger/Logger";
import {ServerName} from "./ServerName";

export class SessionManager {

    private packetPool: PacketPool;

    private server: RakNetServer;
    private socket: UDPServerSocket;

    private bytes: any = {
        received: 0,
        sent: 0
    };

    private sessions: Map<any, Session> = new Map();

    private offlineMessageHandler: OfflineMessageHandler;

    private _shutdown: boolean = false;

    private ticks: number = 0;
    private lastMeasure: number = -1;

    private blocked = new Map();

    //TODO: public portChecking: boolean = false;

    public startTime: number = -1;

    private outgoingMessages: any[] = [];

    constructor(server: RakNetServer, socket: UDPServerSocket){
        this.packetPool = new PacketPool();

        this.server = server;
        this.socket = socket;

        this.startTime = Date.now();

        this.offlineMessageHandler = new OfflineMessageHandler(this);

        this.start();
    }

    static readonly RAKNET_TPS: number = 100;
    static readonly RAKNET_TICK_LENGTH: number = 1 / SessionManager.RAKNET_TPS;

    static hashAddress(ip: string|Session, port: number): string{
        return `${ip}:${port}`;
    }

    start(): void{
        this.socket.getSocket().on("message", (msg, rinfo) => {
            this.bytes.received += msg.length;

            if(this.blocked.has(rinfo.address)){
                return;
            }

            if(msg.length < 1){
                return;
            }

            let stream = new BinaryStream(msg);

            let packetId = stream.getBuffer()[0];

            this.getLogger().debug("Received " + packetId + " with length of " + msg.length + " from " + rinfo.address + ":" + rinfo.port);

            this.handle(packetId, stream, rinfo.address, rinfo.port);
        });

        this.tickProcessor();
    }

    getTimeSinceStart(): number{
        return Date.now() - this.startTime;
    }

    getPort(): number{
        return this.server.getPort();
    }

    getLogger(): Logger{
        return this.server.getLogger();
    }

    /*shutdown(): void{
        this._shutdown = true;
    }*/

    tickProcessor(): void{
        this.lastMeasure = Date.now();

        let int = setInterval(() => {
            if(!this._shutdown){
                this.tick();
            }else{
                clearInterval(int);
            }
        }, SessionManager.RAKNET_TICK_LENGTH * 1000);
    }

    tick(): void{

        let time = Date.now();

        for(let [, session] of this.sessions){
            session.update_func(time);
        }

        if((this.ticks % SessionManager.RAKNET_TPS) === 0){

            /*let diff = Math.max(0.005, time - this.lastMeasure);
            let bandwidth = {
                up: this.bytes.sent / diff,
                down: this.bytes.received / diff
            };*/

            this.lastMeasure = time;
            this.bytes.sent = 0;
            this.bytes.received = 0;

            if(this.blocked.size > 0){
                let now = Date.now();
                for(let [address, timeout] of this.blocked){
                    if(timeout <= now){
                        this.blocked.delete(address);
                    }else{
                        break;
                    }
                }
            }
        }

        ++this.ticks;
    }

    getId(): number{
        return this.server.getId();
    }

    getServerName(): ServerName{
        return this.server.getServerName();
    }

    sendPacket(packet, address, port){

        packet.encode();
        if(address instanceof Session){
            this.bytes.sent += this.socket.sendBuffer(packet.getStream().getBuffer(), address.getAddress(), address.getPort());
        }else{
            this.bytes.sent += this.socket.sendBuffer(packet.getStream().getBuffer(), address, port);
        }

        this.getLogger().debug("Sent " + packet.constructor.name + "(" + packet.getStream().getBuffer().toString() + ") to " + address + ":" + port);
    }

    createSession(address: string, port: number, clientId: number, mtuSize: number): Session{
        let session = new Session(this, address, port, clientId, mtuSize);
        this.sessions.set(SessionManager.hashAddress(address, port), session);
        this.getLogger().debug(`Created session for ${session.toString()} with MTU size ${mtuSize}`);
        return session;
    }

    sessionExists(address: string|Session, port: number): boolean{
        if(address instanceof Session){
            return this.sessions.has(SessionManager.hashAddress(address.getAddress(), address.getPort()));
        }else{
            return this.sessions.has(SessionManager.hashAddress(address, port));
        }
    }

    removeSession(session: Session, reason: string = "unknown"): void{
        let id = SessionManager.hashAddress(session.getAddress(), session.getPort());
        if(this.sessions.has(id)){
            this.sessions.get(id).close();
            this.removeSessionInternal(this);
            this.sendOutgoingMessage({
                purpose: "closeSession",
                data: {
                    identifier: id,
                    reason: reason
                }
            });
        }
    }

    removeSessionInternal(session): void{
        this.sessions.delete(session.toString());
    }

    getSession(address: string, port: number): Session{
        if(this.sessionExists(address, port)){
            return this.sessions.get(SessionManager.hashAddress(address, port));
        }else{
            return null;
        }
    }

    getSessionByIdentifier(identifier): Session{
        return this.sessions.get(identifier);
    }

    getSessions(): Array<any>{
        return Array.from(this.sessions.values());
    }

    openSession(session): void{
        this.sendOutgoingMessage({
            purpose: "openSession",
            data: {
                identifier: session.toString(),
                ip: session.getAddress(),
                port: session.getPort(),
                clientId: session.clientId
            }
        });
    }

    handle(packetId, stream, ip, port): void{
        let session = this.getSession(ip, port);

        this.getLogger().debug("got packet!" + stream);

        if(session === null){
            let packet = this.packetPool.getPacket(packetId);
            if(packet !== null && (packet = new packet(stream))){
                if(packet instanceof OfflineMessage){
                    packet.decode();
                    if(packet.validMagic()){
                        if(!this.offlineMessageHandler.handle(packet, ip, port)){
                            this.getLogger().debug("Received unhandled offline message " + packet.constructor.name + " from " + session);
                        }
                    }else{
                        this.getLogger().debug("Received invalid message from " + session + ":", "0x" + packet.getBuffer().toString("hex"));
                    }
                }
            }
        }else{
            if((packetId & BitFlags.VALID) === 0){
                this.getLogger().debug("Ignored non-connected message for " + session + " due to session already opened");
            }else{
                if((packetId & BitFlags.ACK) === 1){
                    session.handlePacket(new ACK(stream));
                }else if((packetId & BitFlags.NAK) === 1){
                    session.handlePacket(new NACK(stream));
                }else{
                    session.handlePacket(new Datagram(stream));
                }
            }
        }
    }

    /*blockAddress(address, timeout = 300){
        let final = Date.now() + timeout;
        if(!this.blocked.has(address) || timeout !== -1){
            if(timeout === -1){
                let final = Number.MAX_SAFE_INTEGER;
            }else{
                this.getLogger().notice(`Blocked ${address} for ${timeout} seconds`);
            }
            this.blocked.set(address, final);
        }else if(this.blocked.get(address) < final){
            this.blocked.set(address, final);
        }
    }

    unblockAddress(address){
        this.blocked.delete(address);
        this.getLogger().debug(`Unblocked ${address}`);
    }*/

    sendOutgoingMessage(message): void{
        this.outgoingMessages.push(message);
    }

    readOutgoingMessages(): any[]{
        let tmp = this.outgoingMessages;
        this.outgoingMessages = [];
        return tmp;
    }
}