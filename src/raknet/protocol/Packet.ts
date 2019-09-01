import {BinaryStream} from "../../binarystream/BinaryStream";

export class Packet {

    public stream: BinaryStream;

    constructor(stream?: BinaryStream|any){
        if (stream instanceof BinaryStream){
            this.stream = stream;
        }else {
            this.stream = new BinaryStream();
        }
    }

    static getId(){
        return -1;
    }

    getId(){
        // @ts-ignore
        return this.constructor.getId();
    }

    encode(){
        this.encodeHeader();
        this.encodePayload();
    }

    encodeHeader(){
        this.getStream().putByte(this.getId());
    }

    encodePayload(){}

    decode(){
        this.decodeHeader();
        this.decodePayload();
    }

    decodeHeader(){
        this.getStream().getByte();
    }

    decodePayload(){}

    getStream(){
        return this.stream;
    }

    getBuffer(){
        return this.stream.buffer;
    }
}