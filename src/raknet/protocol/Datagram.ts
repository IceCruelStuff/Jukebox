import {Packet} from "./Packet";
import {BitFlags} from "./BitFlags";
import {EncapsulatedPacket} from "./EncapsulatedPacket";

export class Datagram extends Packet{

    public headerFlags: number = 0;

    public packetPair: boolean = false;
    public continuousSend: boolean = false;
    public needsBAndAs: boolean = false;

    public packets: any[] = [];

    public sequenceNumber: number = 0;
    public sendTime: number;

    constructor(stream?){
        super(stream);
    }

    encodeHeader() {
        if(this.packetPair === true){
            this.headerFlags |= BitFlags.PACKET_PAIR;
        }
        if(this.continuousSend === true){
            this.headerFlags |= BitFlags.CONTINUOUS_SEND;
        }
        if(this.needsBAndAs === true){
            this.headerFlags |= BitFlags.NEEDS_B_AND_AS;
        }
        this.getStream().putByte(BitFlags.VALID | this.headerFlags);
    }

    encodePayload() {
        this.getStream().putLTriad(this.sequenceNumber);
        this.packets.forEach(packet => this.getStream().append(packet));
    }

    getLength(){
        let length = 4;
        this.packets.forEach(packet => {
            length += (packet instanceof EncapsulatedPacket ? packet.getLength() : Buffer.byteLength(packet, "hex"));
        });
        return length;
    }

    decodeHeader(){
        this.headerFlags = this.getStream().getByte();
        this.packetPair = (this.headerFlags & BitFlags.PACKET_PAIR) > 0;
        this.continuousSend = (this.headerFlags & BitFlags.CONTINUOUS_SEND) > 0;
        this.needsBAndAs = (this.headerFlags & BitFlags.NEEDS_B_AND_AS) > 0;
    }

    decodePayload(){
        this.sequenceNumber = this.getStream().getLTriad();

        while(!this.getStream().feof()){
            let packet = EncapsulatedPacket.fromBinary(this.stream);

            if(packet.getStream().length === 0){
                break;
            }

            this.packets.push(packet);
        }
    }
}