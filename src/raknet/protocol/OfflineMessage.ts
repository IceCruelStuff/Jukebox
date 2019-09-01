import {Packet} from "./Packet";
import {RakNet} from "../RakNet";

export class OfflineMessage extends Packet{

    public magic;

    constructor(stream?){
        super(stream);
    }

    getMagic(){
        this.magic = this.getBuffer().slice(this.getStream().offset, this.getStream().increaseOffset(16, true));
    }

    putMagic(){
        this.getStream().append(Buffer.from(RakNet.MAGIC, "binary"));
    }

    validMagic(){
        return Buffer.from(this.magic).equals(Buffer.from(RakNet.MAGIC, "binary"));
    }
}