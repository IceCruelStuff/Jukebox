import {AcknowledgementPacket} from "./AcknowledgementPacket";

export class NACK extends AcknowledgementPacket{

    constructor(stream?){
        super(stream);
    }

    getId(): any {
        return 0xA0;
    }
}