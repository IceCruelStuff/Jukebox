"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RecoveryQueue_1 = require("./queues/RecoveryQueue");
const ACKQueue_1 = require("./queues/ACKQueue");
const NACKQueue_1 = require("./queues/NACKQueue");
const SplitQueue_1 = require("./queues/SplitQueue");
const PacketBatchHolder_1 = require("./queues/PacketBatchHolder");
const Datagram_1 = require("../protocol/Datagram");
const Packet_1 = require("../protocol/Packet");
const ACK_1 = require("../protocol/ACK");
const NACK_1 = require("../protocol/NACK");
const RakNet_1 = require("../RakNet");
const PacketReliability_1 = require("../protocol/PacketReliability");
const EncapsulatedPacket_1 = require("../protocol/EncapsulatedPacket");
const BinaryStream_1 = require("../../binarystream/BinaryStream");
const ConnectedPing_1 = require("../protocol/ConnectedPing");
const MessageIdentifiers_1 = require("../protocol/MessageIdentifiers");
const ConnectionRequest_1 = require("../protocol/ConnectionRequest");
const ConnectionRequestAccepted_1 = require("../protocol/ConnectionRequestAccepted");
const NewIncomingConnection_1 = require("../protocol/NewIncomingConnection");
const ConnectedPong_1 = require("../protocol/ConnectedPong");
const DisconnectionNotification_1 = require("../protocol/DisconnectionNotification");
class Session {
    constructor(sessionManager, address, port, clientId, mtuSize) {
        this.MAX_SPLIT_SIZE = 128;
        this.MAX_SPLIT_COUNT = 4;
        this.state = Session.STATE_CONNECTING;
        this.currentSequenceNumber = 0;
        this.messageIndex = 0;
        this.channelIndex = [];
        this.splitId = 0;
        this.isActive = false;
        this.packetsToSend = [];
        this.lastPingMeasure = 1;
        this.recoveryQueue = new RecoveryQueue_1.RecoveryQueue();
        this.ACKQueue = new ACKQueue_1.ACKQueue();
        this.NACKQueue = new NACKQueue_1.NACKQueue();
        this.splitQueue = new SplitQueue_1.SplitQueue();
        this.packetBatches = new PacketBatchHolder_1.PacketBatchHolder();
        this.sessionManager = sessionManager;
        this.address = address;
        this.port = port;
        this.clientId = clientId;
        this.mtuSize = mtuSize;
        this.setSendQueue();
        this.lastUpdate = Date.now();
    }
    setSendQueue() {
        this._sendQueue = new Datagram_1.Datagram();
        this._sendQueue.needsBAndAs = true;
    }
    getAddress() {
        return this.address;
    }
    getPort() {
        return this.port;
    }
    getClientId() {
        return this.clientId;
    }
    isConnecting() {
        return this.state === Session.STATE_CONNECTING;
    }
    isConnected() {
        return this.state !== Session.STATE_DISCONNECTING && this.state !== Session.STATE_DISCONNECTED;
    }
    setConnected() {
        this.state = Session.STATE_CONNECTED;
        this.lastUpdate = Date.now();
        this.sessionManager.getLogger().debug(this + " is now connected.");
    }
    update_func(time) {
        if (!this.isActive && (this.lastUpdate + 10000) < time) {
            this.disconnect("timeout");
            return;
        }
        if (this.state === Session.STATE_DISCONNECTING && ((this.ACKQueue.isEmpty() && this.NACKQueue.isEmpty() && this.packetsToSend.length === 0 && this.recoveryQueue.isEmpty()) &&
            this.disconnectionTime + 10 < time)) {
            this.close();
            return;
        }
        this.isActive = false;
        if (!this.ACKQueue.isEmpty()) {
            let pk = new ACK_1.ACK();
            pk.packets = this.ACKQueue.getAll();
            this.sendPacket(pk);
            this.ACKQueue.clear();
        }
        if (!this.NACKQueue.isEmpty()) {
            let pk = new NACK_1.NACK();
            pk.packets = this.NACKQueue.getAll();
            this.sendPacket(pk);
            this.NACKQueue.clear();
        }
        if (this.packetsToSend.length > 0) {
            let limit = 16;
            for (let k in this.packetsToSend) {
                this.sendDatagram(this.packetsToSend[k]);
                delete this.packetsToSend[k];
                if (--limit <= 0) {
                    break;
                }
            }
        }
        if (this.lastPingTime + 5000 < time) {
            this.sendPing();
            this.lastPingTime = time;
        }
        this.sendQueue();
    }
    close() {
        if (this.state !== Session.STATE_DISCONNECTED) {
            this.state = Session.STATE_DISCONNECTED;
            this.queueConnectedPacket(new DisconnectionNotification_1.DisconnectionNotification(), PacketReliability_1.PacketReliability.RELIABLE_ORDERED, 0, RakNet_1.RakNet.PRIORITY_IMMEDIATE);
            this.sessionManager.getLogger().debug(`Closed session for ${this.toString()}`);
            this.sessionManager.removeSessionInternal(this);
            this.sessionManager = null;
        }
    }
    disconnect(reason = "unknown") {
        this.sessionManager.removeSession(this, reason);
    }
    handlePacket(packet) {
        this.isActive = true;
        this.lastUpdate = Date.now();
        if (packet instanceof Datagram_1.Datagram || packet instanceof ACK_1.ACK || packet instanceof NACK_1.NACK) {
            // this.sessionManager.getLogger().debug("Got " + protocol.constructor.name + "(" + protocol.stream.buffer.toString("hex") + ") from " + this);
        }
        if (packet instanceof Datagram_1.Datagram) {
            packet.decode();
            let diff = packet.sequenceNumber - this.lastSequenceNumber;
            if (!this.NACKQueue.isEmpty()) {
                this.NACKQueue.remove(packet.sequenceNumber);
                if (diff !== 1) {
                    for (let i = this.lastSequenceNumber + 1; i < packet.sequenceNumber; i++) {
                        this.NACKQueue.add(i);
                    }
                }
            }
            this.ACKQueue.add(packet.sequenceNumber);
            if (diff >= 1) {
                this.lastSequenceNumber = packet.sequenceNumber;
            }
            packet.packets.forEach(pk => this.handleEncapsulatedPacket(pk));
        }
        else {
            if (packet instanceof ACK_1.ACK) {
                packet.decode();
                this.recoveryQueue.recover(packet.packets).forEach(datagram => {
                    this.recoveryQueue.remove(datagram.sequenceNumber);
                });
            }
            else if (packet instanceof NACK_1.NACK) {
                packet.decode();
                this.recoveryQueue.recover(packet.packets).forEach(datagram => {
                    this.packetsToSend.push(datagram);
                    this.recoveryQueue.remove(datagram.sequenceNumber);
                });
            }
        }
    }
    handleEncapsulatedPacket(packet) {
        if (!(packet instanceof EncapsulatedPacket_1.EncapsulatedPacket)) {
            throw new TypeError("Expecting EncapsulatedPacket, got " + (packet.constructor.name ? packet.constructor.name : packet));
        }
        //this.sessionManager.getLogger().debug("Handling EncapsulatedPacket("+protocol.getBuffer().toString("hex")+")["+protocol.getBuffer().length+"] from "+this);
        if (packet.hasSplit) {
            if (this.isConnected()) {
                this.handleSplitPacket(packet);
            }
            return;
        }
        let id = packet.getBuffer()[0];
        let dpk, pk;
        switch (id) {
            case ConnectionRequest_1.ConnectionRequest.getId():
                this.sessionManager.getLogger().debug("Got ConnectionRequest from " + this);
                dpk = new ConnectionRequest_1.ConnectionRequest(packet.getStream());
                dpk.decode();
                this.clientId = dpk.clientId;
                pk = new ConnectionRequestAccepted_1.ConnectionRequestAccepted();
                pk.address = this.getAddress();
                pk.port = this.getPort();
                pk.sendPingTime = dpk.sendPingTime;
                pk.sendPongTime = this.sessionManager.getTimeSinceStart();
                this.queueConnectedPacket(pk, PacketReliability_1.PacketReliability.UNRELIABLE, 0, RakNet_1.RakNet.PRIORITY_IMMEDIATE);
                break;
            case NewIncomingConnection_1.NewIncomingConnection.getId():
                this.sessionManager.getLogger().debug("Got NewIncomingConnection from " + this);
                dpk = new NewIncomingConnection_1.NewIncomingConnection(packet.getStream());
                dpk.decode();
                if (dpk.port === this.sessionManager.getPort()) { //todo: if port checking
                    this.setConnected();
                    this.sessionManager.openSession(this);
                    this.sendPing();
                }
                break;
            case ConnectedPing_1.ConnectedPing.getId():
                dpk = new ConnectedPing_1.ConnectedPing(packet.getStream());
                dpk.decode();
                pk = new ConnectedPong_1.ConnectedPong();
                pk.sendPingTime = dpk.sendPingTime;
                pk.sendPongTime = this.sessionManager.getTimeSinceStart();
                this.queueConnectedPacket(pk, PacketReliability_1.PacketReliability.UNRELIABLE, 0);
                break;
            case ConnectedPong_1.ConnectedPong.getId():
                dpk = new ConnectedPong_1.ConnectedPong(packet.getStream());
                dpk.decode();
                this.handlePong(dpk.sendPingTime, dpk.sendPongTime);
                break;
            case DisconnectionNotification_1.DisconnectionNotification.getId():
                this.disconnect("client disconnect"); //supposed to send ack
                break;
            case MessageIdentifiers_1.MessageIdentifiers.MINECRAFT_HEADER:
                this.packetBatches.add(packet);
                this.sessionManager.getLogger().debug("Got a Minecraft packet");
                break;
            default:
                this.packetBatches.add(packet);
                this.sessionManager.getLogger().debug("Got unknown packet: ", id);
                break;
        }
    }
    handlePong(ping, pong) {
        this.lastPingMeasure = this.sessionManager.getTimeSinceStart() - ping;
    }
    handleSplitPacket(packet) {
        if (!(packet instanceof EncapsulatedPacket_1.EncapsulatedPacket)) {
            throw new TypeError("Expecting EncapsulatedPacket, got " + (packet.constructor.name ? packet.constructor.name : packet));
        }
        if (packet.splitCount >= this.MAX_SPLIT_SIZE || packet.splitIndex >= this.MAX_SPLIT_SIZE || packet.splitIndex < 0) {
            return;
        }
        if (this.splitQueue.size >= this.MAX_SPLIT_COUNT) {
            return;
        }
        this.splitQueue.add(packet);
        if (this.splitQueue.getSplitSize(packet.splitID) === packet.splitCount) {
            let pk = new EncapsulatedPacket_1.EncapsulatedPacket();
            let stream = new BinaryStream_1.BinaryStream();
            let packets = this.splitQueue.getSplits(packet.splitID);
            for (let [, packet] of packets) {
                stream.append(packet.getBuffer());
            }
            this.splitQueue.remove(packet.splitID);
            pk.stream = stream.flip();
            pk.length = stream.offset;
            this.handleEncapsulatedPacket(pk);
        }
    }
    sendPacket(pk) {
        if (pk instanceof Packet_1.Packet) {
            this.sessionManager.sendPacket(pk, this.address, this.port);
            return true;
        }
        return false;
    }
    sendDatagram(datagram) {
        if (!(datagram instanceof Datagram_1.Datagram)) {
            throw new TypeError("Expecting Datagram, got " + (datagram.constructor.name ? datagram.constructor.name : datagram));
        }
        if (datagram.sequenceNumber !== null) {
            this.recoveryQueue.remove(datagram.sequenceNumber);
        }
        datagram.sequenceNumber = this.currentSequenceNumber++;
        datagram.sendTime = Date.now();
        this.recoveryQueue.addRecoveryFor(datagram);
        this.sendPacket(datagram);
    }
    sendPing(reliability = PacketReliability_1.PacketReliability.UNRELIABLE) {
        let pk = new ConnectedPing_1.ConnectedPing();
        pk.sendPingTime = this.sessionManager.getTimeSinceStart();
        this.queueConnectedPacket(pk, reliability, 0, RakNet_1.RakNet.PRIORITY_IMMEDIATE);
    }
    queueConnectedPacket(packet, reliability, orderChannel, flags = RakNet_1.RakNet.PRIORITY_NORMAL) {
        packet.encode();
        let pk = new EncapsulatedPacket_1.EncapsulatedPacket();
        pk.reliability = reliability;
        pk.orderChannel = orderChannel;
        pk.stream = new BinaryStream_1.BinaryStream(packet.getBuffer());
        // this.sessionManager.getLogger().debug("Queuing "+packet.constructor.name+"(" + packet.getBuffer().toHex() + ")");
        this.addEncapsulatedToQueue(pk, flags);
    }
    queueConnectedPacketFromServer(packet, needACK, immediate) {
        //console.log(immediate) if immediate it doesnt seem to do anything (client doesnt recieve i think / OR it doesnt do anything with it)
        // @ts-ignore
        return this.queueConnectedPacket(packet, (needACK === true ? RakNet_1.RakNet.FLAG_NEED_ACK : 0) | (immediate === true ? RakNet_1.RakNet.PRIORITY_IMMEDIATE : RakNet_1.RakNet.PRIORITY_NORMAL));
    }
    addEncapsulatedToQueue(packet, flags = RakNet_1.RakNet.PRIORITY_NORMAL) {
        if (!(packet instanceof EncapsulatedPacket_1.EncapsulatedPacket)) {
            throw new TypeError("Expecting EncapsulatedPacket, got " + packet);
        }
        if ((packet.needACK = (flags & RakNet_1.RakNet.FLAG_NEED_ACK) > 0) === true) {
            this._sendQueue.packets.push(Object.assign(new EncapsulatedPacket_1.EncapsulatedPacket(), packet));
            packet.needACK = false;
        }
        else {
            this._sendQueue.packets.push(packet.toBinary());
        }
        if (packet.isReliable()) {
            packet.messageIndex = this.messageIndex++;
        }
        if (packet.isSequenced()) {
            packet.orderIndex = this.channelIndex[packet.orderChannel]++;
        }
        let maxSize = this.mtuSize - 60;
        if (packet.getBuffer().length > maxSize) {
            let splitId = ++this.splitId % 65536;
            let splitIndex = 0;
            let splitCount = Math.ceil(packet.getBuffer().length / maxSize);
            while (!packet.getStream().feof()) {
                let stream = packet.getBuffer().slice(packet.getStream().offset, packet.getStream().offset += maxSize);
                let pk = new EncapsulatedPacket_1.EncapsulatedPacket();
                pk.splitID = splitId;
                pk.hasSplit = true;
                pk.splitCount = splitCount;
                pk.reliability = packet.reliability;
                pk.splitIndex = splitIndex;
                pk.stream = stream;
                if (splitIndex > 0) {
                    pk.messageIndex = this.messageIndex++;
                }
                else {
                    pk.messageIndex = packet.messageIndex;
                }
                pk.orderChannel = packet.orderChannel;
                pk.orderIndex = packet.orderIndex;
                this.addToQueue(pk, flags | RakNet_1.RakNet.PRIORITY_IMMEDIATE);
                splitIndex++;
            }
        }
        else {
            this.addToQueue(packet, flags);
        }
    }
    addToQueue(pk, flags = RakNet_1.RakNet.PRIORITY_NORMAL) {
        let priority = flags & 0x07;
        let length = this._sendQueue.getLength();
        if ((length + pk.getLength()) > (this.mtuSize - 36)) {
            this.sendQueue();
        }
        if (pk.needACK) {
            this._sendQueue.packets.push(Object.assign(new EncapsulatedPacket_1.EncapsulatedPacket(), pk));
            pk.needACK = false;
        }
        else {
            this._sendQueue.packets.push(pk.toBinary());
        }
        if (priority === RakNet_1.RakNet.PRIORITY_IMMEDIATE) {
            this.sendQueue();
        }
    }
    sendQueue() {
        if (this._sendQueue.packets.length > 0) {
            this.sendDatagram(this._sendQueue);
            this.setSendQueue();
        }
    }
    toString() {
        return this.address + ":" + this.port;
    }
}
exports.Session = Session;
Session.STATE_CONNECTING = 0;
Session.STATE_CONNECTED = 1;
Session.STATE_DISCONNECTING = 2;
Session.STATE_DISCONNECTED = 3;
//# sourceMappingURL=Session.js.map