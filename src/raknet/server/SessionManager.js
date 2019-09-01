"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketPool_1 = require("./PacketPool");
const OfflineMessageHandler_1 = require("./OfflineMessageHandler");
const BinaryStream_1 = require("../../binarystream/BinaryStream");
const OfflineMessage_1 = require("../protocol/OfflineMessage");
const BitFlags_1 = require("../protocol/BitFlags");
const ACK_1 = require("../protocol/ACK");
const NACK_1 = require("../protocol/NACK");
const Datagram_1 = require("../protocol/Datagram");
const Session_1 = require("./Session");
class SessionManager {
    constructor(server, socket) {
        this.bytes = {
            received: 0,
            sent: 0
        };
        this.sessions = new Map();
        this._shutdown = false;
        this.ticks = 0;
        this.lastMeasure = -1;
        this.blocked = new Map();
        //TODO: public portChecking: boolean = false;
        this.startTime = -1;
        this.outgoingMessages = [];
        this.packetPool = new PacketPool_1.PacketPool();
        this.server = server;
        this.socket = socket;
        this.startTime = Date.now();
        this.offlineMessageHandler = new OfflineMessageHandler_1.OfflineMessageHandler(this);
        this.start();
    }
    static hashAddress(ip, port) {
        return `${ip}:${port}`;
    }
    start() {
        this.socket.getSocket().on("message", (msg, rinfo) => {
            this.bytes.received += msg.length;
            if (this.blocked.has(rinfo.address)) {
                return;
            }
            if (msg.length < 1) {
                return;
            }
            let stream = new BinaryStream_1.BinaryStream(msg);
            let packetId = stream.getBuffer()[0];
            this.getLogger().debug("Received " + packetId + " with length of " + msg.length + " from " + rinfo.address + ":" + rinfo.port);
            this.handle(packetId, stream, rinfo.address, rinfo.port);
        });
        this.tickProcessor();
    }
    getTimeSinceStart() {
        return Date.now() - this.startTime;
    }
    getPort() {
        return this.server.getPort();
    }
    getLogger() {
        return this.server.getLogger();
    }
    /*shutdown(): void{
        this._shutdown = true;
    }*/
    tickProcessor() {
        this.lastMeasure = Date.now();
        let int = setInterval(() => {
            if (!this._shutdown) {
                this.tick();
            }
            else {
                clearInterval(int);
            }
        }, SessionManager.RAKNET_TICK_LENGTH * 1000);
    }
    tick() {
        let time = Date.now();
        for (let [, session] of this.sessions) {
            session.update_func(time);
        }
        if ((this.ticks % SessionManager.RAKNET_TPS) === 0) {
            /*let diff = Math.max(0.005, time - this.lastMeasure);
            let bandwidth = {
                up: this.bytes.sent / diff,
                down: this.bytes.received / diff
            };*/
            this.lastMeasure = time;
            this.bytes.sent = 0;
            this.bytes.received = 0;
            if (this.blocked.size > 0) {
                let now = Date.now();
                for (let [address, timeout] of this.blocked) {
                    if (timeout <= now) {
                        this.blocked.delete(address);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        ++this.ticks;
    }
    getId() {
        return this.server.getId();
    }
    getServerName() {
        return this.server.getServerName();
    }
    sendPacket(packet, address, port) {
        packet.encode();
        if (address instanceof Session_1.Session) {
            this.bytes.sent += this.socket.sendBuffer(packet.getStream().getBuffer(), address.getAddress(), address.getPort());
        }
        else {
            this.bytes.sent += this.socket.sendBuffer(packet.getStream().getBuffer(), address, port);
        }
        this.getLogger().debug("Sent " + packet.constructor.name + "(" + packet.getStream().getBuffer().toString() + ") to " + address + ":" + port);
    }
    createSession(address, port, clientId, mtuSize) {
        let session = new Session_1.Session(this, address, port, clientId, mtuSize);
        this.sessions.set(SessionManager.hashAddress(address, port), session);
        this.getLogger().debug(`Created session for ${session.toString()} with MTU size ${mtuSize}`);
        return session;
    }
    sessionExists(address, port) {
        if (address instanceof Session_1.Session) {
            return this.sessions.has(SessionManager.hashAddress(address.getAddress(), address.getPort()));
        }
        else {
            return this.sessions.has(SessionManager.hashAddress(address, port));
        }
    }
    removeSession(session, reason = "unknown") {
        let id = SessionManager.hashAddress(session.getAddress(), session.getPort());
        if (this.sessions.has(id)) {
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
    removeSessionInternal(session) {
        this.sessions.delete(session.toString());
    }
    getSession(address, port) {
        if (this.sessionExists(address, port)) {
            return this.sessions.get(SessionManager.hashAddress(address, port));
        }
        else {
            return null;
        }
    }
    getSessionByIdentifier(identifier) {
        return this.sessions.get(identifier);
    }
    getSessions() {
        return Array.from(this.sessions.values());
    }
    openSession(session) {
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
    handle(packetId, stream, ip, port) {
        let session = this.getSession(ip, port);
        this.getLogger().debug("got packet!" + stream);
        if (session === null) {
            let packet = this.packetPool.getPacket(packetId);
            if (packet !== null && (packet = new packet(stream))) {
                if (packet instanceof OfflineMessage_1.OfflineMessage) {
                    packet.decode();
                    if (packet.validMagic()) {
                        if (!this.offlineMessageHandler.handle(packet, ip, port)) {
                            this.getLogger().debug("Received unhandled offline message " + packet.constructor.name + " from " + session);
                        }
                    }
                    else {
                        this.getLogger().debug("Received invalid message from " + session + ":", "0x" + packet.getBuffer().toString("hex"));
                    }
                }
            }
        }
        else {
            if ((packetId & BitFlags_1.BitFlags.VALID) === 0) {
                this.getLogger().debug("Ignored non-connected message for " + session + " due to session already opened");
            }
            else {
                if ((packetId & BitFlags_1.BitFlags.ACK) === 1) {
                    session.handlePacket(new ACK_1.ACK(stream));
                }
                else if ((packetId & BitFlags_1.BitFlags.NAK) === 1) {
                    session.handlePacket(new NACK_1.NACK(stream));
                }
                else {
                    session.handlePacket(new Datagram_1.Datagram(stream));
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
    sendOutgoingMessage(message) {
        this.outgoingMessages.push(message);
    }
    readOutgoingMessages() {
        let tmp = this.outgoingMessages;
        this.outgoingMessages = [];
        return tmp;
    }
}
exports.SessionManager = SessionManager;
SessionManager.RAKNET_TPS = 100;
SessionManager.RAKNET_TICK_LENGTH = 1 / SessionManager.RAKNET_TPS;
//# sourceMappingURL=SessionManager.js.map