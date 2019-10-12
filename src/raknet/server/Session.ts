import {SessionManager} from "./SessionManager";
import {RecoveryQueue} from "./queues/RecoveryQueue";
import {ACKQueue} from "./queues/ACKQueue";
import {NACKQueue} from "./queues/NACKQueue";
import {SplitQueue} from "./queues/SplitQueue";
import {PacketBatchHolder} from "./queues/PacketBatchHolder";
import {Datagram} from "../protocol/Datagram";
import {Packet} from "../protocol/Packet";
import {ACK} from "../protocol/ACK";
import {NACK} from "../protocol/NACK";
import {RakNet} from "../RakNet";
import {PacketReliability} from "../protocol/PacketReliability";
import {EncapsulatedPacket} from "../protocol/EncapsulatedPacket";
import {BinaryStream} from "../../binarystream/BinaryStream";
import {ConnectedPing} from "../protocol/ConnectedPing";
import {MessageIdentifiers} from "../protocol/MessageIdentifiers";
import {ConnectionRequest} from "../protocol/ConnectionRequest";
import {ConnectionRequestAccepted} from "../protocol/ConnectionRequestAccepted";
import {NewIncomingConnection} from "../protocol/NewIncomingConnection";
import {ConnectedPong} from "../protocol/ConnectedPong";
import {DisconnectionNotification} from "../protocol/DisconnectionNotification";

export class Session{

    static readonly STATE_CONNECTING: number = 0;
    static readonly STATE_CONNECTED: number = 1;
    static readonly STATE_DISCONNECTING: number = 2;
    static readonly STATE_DISCONNECTED: number = 3;

    readonly MAX_SPLIT_SIZE: number = 128;
    readonly MAX_SPLIT_COUNT: number = 4;

    public sessionManager: SessionManager;

    public address: string;
    public port: number;
    public state: number = Session.STATE_CONNECTING;
    public clientId: number;
    public mtuSize: number;

    public lastSequenceNumber: number;
    public currentSequenceNumber: number = 0;

    public messageIndex: number = 0;
    public channelIndex: [] = [];

    public splitId: number = 0;

    public lastUpdate: number;
    public disconnectionTime: number;

    public isActive: boolean = false;

    public packetsToSend: any[] = [];

    private _sendQueue: Datagram;

    public recoveryQueue: RecoveryQueue;
    public ACKQueue: ACKQueue;
    public NACKQueue: NACKQueue;
    public splitQueue: SplitQueue;
    public packetBatches: PacketBatchHolder;

    public lastPingMeasure: number = 1;
    public lastPingTime: number;

    constructor(sessionManager: SessionManager, address: string, port: number, clientId: number, mtuSize: number){

        this.recoveryQueue = new RecoveryQueue();
        this.ACKQueue = new ACKQueue();
        this.NACKQueue = new NACKQueue();
        this.splitQueue = new SplitQueue();
        this.packetBatches = new PacketBatchHolder();

        this.sessionManager = sessionManager;

        this.address = address;
        this.port = port;
        this.clientId = clientId;
        this.mtuSize = mtuSize;

        this.setSendQueue();

        this.lastUpdate = Date.now();
    }

    setSendQueue(): void{
        this._sendQueue = new Datagram();
        this._sendQueue.needsBAndAs = true
    }

    getAddress(): string{
        return this.address;
    }

    getPort(): number{
        return this.port;
    }

    getClientId(): number{
        return this.clientId;
    }

    isConnecting(): boolean{
        return this.state === Session.STATE_CONNECTING;
    }

    isConnected(): boolean{
        return this.state !== Session.STATE_DISCONNECTING && this.state !== Session.STATE_DISCONNECTED;
    }

    setConnected(): void {
        this.state = Session.STATE_CONNECTED;
        this.lastUpdate = Date.now();
        this.sessionManager.getLogger().debug(this + " is now connected.");
    }

    update(time): void{

        if(!this.isActive && (this.lastUpdate + 10000) < time){
            this.disconnect("timeout");
            return;
        }

        if(this.state === Session.STATE_DISCONNECTING && (
            (this.ACKQueue.isEmpty() && this.NACKQueue.isEmpty() && this.packetsToSend.length === 0 && this.recoveryQueue.isEmpty()) &&
            this.disconnectionTime + 10 < time)
        ){
            this.close();
            return;
        }

        this.isActive = false;

        if(!this.ACKQueue.isEmpty()){
            let pk = new ACK();
            pk.packets = this.ACKQueue.getAll();
            this.sendPacket(pk);
            this.ACKQueue.clear();
        }

        if(!this.NACKQueue.isEmpty()){
            let pk = new NACK();
            pk.packets = this.NACKQueue.getAll();
            this.sendPacket(pk);
            this.NACKQueue.clear();
        }

        if(this.packetsToSend.length > 0){
            let limit = 16;
            for(let k in this.packetsToSend){
                this.sendDatagram(this.packetsToSend[k]);
                delete this.packetsToSend[k];

                if(--limit <= 0){
                    break;
                }
            }
        }

        if(this.lastPingTime + 5000 < time){
            this.sendPing();
            this.lastPingTime = time;
        }

        this.sendQueue();
    }

    close(){
        if(this.state !== Session.STATE_DISCONNECTED){
            this.state = Session.STATE_DISCONNECTED;

            this.queueConnectedPacket(new DisconnectionNotification(), PacketReliability.RELIABLE_ORDERED, 0, RakNet.PRIORITY_IMMEDIATE);

            this.sessionManager.getLogger().debug(`Closed session for ${this.toString()}`);
            this.sessionManager.removeSessionInternal(this);
            this.sessionManager = null;
        }
    }

    disconnect(reason = "unknown"){
        this.sessionManager.removeSession(this, reason);
    }

    handlePacket(packet){

        this.isActive = true;
        this.lastUpdate = Date.now();

        if(packet instanceof Datagram || packet instanceof ACK || packet instanceof NACK){
            // this.sessionManager.getLogger().debug("Got " + protocol.constructor.name + "(" + protocol.stream.buffer.toString("hex") + ") from " + this);
        }

        if(packet instanceof Datagram){
            packet.decode();

            let diff = packet.sequenceNumber - this.lastSequenceNumber;

            if(!this.NACKQueue.isEmpty()){
                this.NACKQueue.remove(packet.sequenceNumber);
                if(diff !== 1){
                    for(let i = this.lastSequenceNumber + 1; i < packet.sequenceNumber; i++){
                        this.NACKQueue.add(i);
                    }
                }
            }

            this.ACKQueue.add(packet.sequenceNumber);

            if(diff >= 1){
                this.lastSequenceNumber = packet.sequenceNumber;
            }

            packet.packets.forEach(pk => this.handleEncapsulatedPacket(pk));
        }else{
            if(packet instanceof ACK){
                packet.decode();
                this.recoveryQueue.recover(packet.packets).forEach(datagram => {
                    this.recoveryQueue.remove(datagram.sequenceNumber);
                });
            }else if(packet instanceof NACK){
                packet.decode();
                this.recoveryQueue.recover(packet.packets).forEach(datagram => {
                    this.packetsToSend.push(datagram);
                    this.recoveryQueue.remove(datagram.sequenceNumber);
                });
            }
        }
    }

    handleEncapsulatedPacket(packet): void{
        if(!(packet instanceof EncapsulatedPacket)){
            throw new TypeError("Expecting EncapsulatedPacket, got " + (packet.constructor.name ? packet.constructor.name : packet));
        }

        //this.sessionManager.getLogger().debug("Handling EncapsulatedPacket("+protocol.getBuffer().toString("hex")+")["+protocol.getBuffer().length+"] from "+this);

        if(packet.hasSplit){
            if(this.isConnected()){
                this.handleSplitPacket(packet);
            }
            return;
        }

        let id = packet.getBuffer()[0];
        let dpk, pk;
        switch(id){
            case ConnectionRequest.getId():
                this.sessionManager.getLogger().debug("Got ConnectionRequest from " + this);
                dpk = new ConnectionRequest(packet.getStream());
                dpk.decode();

                this.clientId = dpk.clientId;

                pk = new ConnectionRequestAccepted();
                pk.address = this.getAddress();
                pk.port = this.getPort();
                pk.sendPingTime = dpk.sendPingTime;
                pk.sendPongTime = this.sessionManager.getTimeSinceStart();
                this.queueConnectedPacket(pk, PacketReliability.UNRELIABLE, 0, RakNet.PRIORITY_IMMEDIATE);
                break;

            case NewIncomingConnection.getId():
                this.sessionManager.getLogger().debug("Got NewIncomingConnection from " + this);

                dpk = new NewIncomingConnection(packet.getStream());
                dpk.decode();

                if(dpk.port === this.sessionManager.getPort()){ //todo: if port checking
                    this.setConnected();

                    this.sessionManager.openSession(this);

                    this.sendPing();
                }
                break;

            case ConnectedPing.getId():
                dpk = new ConnectedPing(packet.getStream());
                dpk.decode();

                pk = new ConnectedPong();
                pk.sendPingTime = dpk.sendPingTime;
                pk.sendPongTime = this.sessionManager.getTimeSinceStart();
                this.queueConnectedPacket(pk, PacketReliability.UNRELIABLE, 0);
                break;

            case ConnectedPong.getId():
                dpk = new ConnectedPong(packet.getStream());
                dpk.decode();

                this.handlePong(dpk.sendPingTime, dpk.sendPongTime);
                break;

            case DisconnectionNotification.getId():
                this.disconnect("client disconnect"); //supposed to send ack
                break;

            case MessageIdentifiers.MINECRAFT_HEADER:
                this.packetBatches.add(packet);
                this.sessionManager.getLogger().debug("Got a Minecraft packet");
                break;

            default:
                this.packetBatches.add(packet);
                this.sessionManager.getLogger().debug("Got unknown packet: ", id);
                break;
        }
    }

    handlePong(ping: number, pong: number): void{
        this.lastPingMeasure = this.sessionManager.getTimeSinceStart() - ping;
    }

    handleSplitPacket(packet): void{
        if(!(packet instanceof EncapsulatedPacket)){
            throw new TypeError("Expecting EncapsulatedPacket, got " + (packet.constructor.name ? packet.constructor.name : packet));
        }

        if(packet.splitCount >= this.MAX_SPLIT_SIZE || packet.splitIndex >= this.MAX_SPLIT_SIZE || packet.splitIndex < 0){
            return;
        }

        if(this.splitQueue.size >= this.MAX_SPLIT_COUNT){
            return;
        }
        this.splitQueue.add(packet);

        if(this.splitQueue.getSplitSize(packet.splitID) === packet.splitCount){
            let pk = new EncapsulatedPacket();
            let stream = new BinaryStream();
            let packets = this.splitQueue.getSplits(packet.splitID);
            for(let [, packet] of packets){
                stream.append(packet.getBuffer());
            }
            this.splitQueue.remove(packet.splitID);

            pk.stream = stream.flip();
            pk.length = stream.offset;

            this.handleEncapsulatedPacket(pk);
        }
    }

    sendPacket(pk): boolean{
        if(pk instanceof Packet){
            this.sessionManager.sendPacket(pk, this.address, this.port);
            return true;
        }
        return false;
    }

    sendDatagram(datagram): void{
        if(!(datagram instanceof Datagram)){
            throw new TypeError("Expecting Datagram, got " + (datagram.constructor.name ? datagram.constructor.name : datagram));
        }

        if(datagram.sequenceNumber !== null){
            this.recoveryQueue.remove(datagram.sequenceNumber);
        }
        datagram.sequenceNumber = this.currentSequenceNumber++;
        datagram.sendTime = Date.now();
        this.recoveryQueue.addRecoveryFor(datagram);
        this.sendPacket(datagram);
    }

    sendPing(reliability = PacketReliability.UNRELIABLE): void{
        let pk = new ConnectedPing();
        pk.sendPingTime = this.sessionManager.getTimeSinceStart();
        this.queueConnectedPacket(pk, reliability, 0, RakNet.PRIORITY_IMMEDIATE);
    }

    queueConnectedPacket(packet: Packet, reliability: number, orderChannel: number, flags: number = RakNet.PRIORITY_NORMAL){
        packet.encode();

        let pk = new EncapsulatedPacket();
        pk.reliability = reliability;
        pk.orderChannel = orderChannel;
        pk.stream = new BinaryStream(packet.getBuffer());

        // this.sessionManager.getLogger().debug("Queuing "+packet.constructor.name+"(" + packet.getBuffer().toHex() + ")");

        this.addEncapsulatedToQueue(pk, flags);
    }

    queueConnectedPacketFromServer(packet, needACK, immediate){
        //console.log(immediate) if immediate it doesnt seem to do anything (client doesnt recieve i think / OR it doesnt do anything with it)
        // @ts-ignore
        return this.queueConnectedPacket(packet, (needACK === true ? RakNet.FLAG_NEED_ACK : 0) | (immediate === true ? RakNet.PRIORITY_IMMEDIATE : RakNet.PRIORITY_NORMAL));
    }

    addEncapsulatedToQueue(packet: EncapsulatedPacket, flags: number = RakNet.PRIORITY_NORMAL){
        if(!(packet instanceof EncapsulatedPacket)){
            throw new TypeError("Expecting EncapsulatedPacket, got " + packet);
        }
        
        if ((packet.needACK = (flags & RakNet.FLAG_NEED_ACK) > 0) === true){
            this._sendQueue.packets.push(Object.assign(new EncapsulatedPacket(), packet));
                packet.needACK = false;
            } else {
            this._sendQueue.packets.push(packet.toBinary());
        }

        if(packet.isReliable()){
            packet.messageIndex = this.messageIndex++;
        }

        if(packet.isSequenced()){
            packet.orderIndex = this.channelIndex[packet.orderChannel]++;
        }

        let maxSize = this.mtuSize - 60;

        if(packet.getBuffer().length > maxSize){
            let splitId = ++this.splitId % 65536;
            let splitIndex = 0;
            let splitCount = Math.ceil(packet.getBuffer().length / maxSize);
            while(!packet.getStream().feof()){
                let stream = packet.getBuffer().slice(packet.getStream().offset, packet.getStream().offset += maxSize);
                let pk = new EncapsulatedPacket();
                pk.splitID = splitId;
                pk.hasSplit = true;
                pk.splitCount = splitCount;
                pk.reliability = packet.reliability;
                pk.splitIndex = splitIndex;
                pk.stream = stream;

                if(splitIndex > 0){
                    pk.messageIndex = this.messageIndex++;
                }else{
                    pk.messageIndex = packet.messageIndex;
                }

                pk.orderChannel = packet.orderChannel;
                pk.orderIndex = packet.orderIndex;

                this.addToQueue(pk, flags | RakNet.PRIORITY_IMMEDIATE);
                splitIndex++;
            }
        }else{
            this.addToQueue(packet, flags);
        }
    }

    addToQueue(pk, flags = RakNet.PRIORITY_NORMAL){
        let priority = flags & 0x07;

        let length = this._sendQueue.getLength();
        if((length + pk.getLength()) > (this.mtuSize - 36)){
            this.sendQueue();
        }

        if(pk.needACK){
            this._sendQueue.packets.push(Object.assign(new EncapsulatedPacket(), pk));
            pk.needACK = false;
        }else{
            this._sendQueue.packets.push(pk.toBinary());
        }

        if(priority === RakNet.PRIORITY_IMMEDIATE){
            this.sendQueue();
        }
    }

    sendQueue(){
        if(this._sendQueue.packets.length > 0){
            this.sendDatagram(this._sendQueue);
            this.setSendQueue();
        }
    }

    toString(){
        return this.address + ":" + this.port;
    }
}