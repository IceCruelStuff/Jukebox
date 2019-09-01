import {AcknowledgementPacket} from "./AcknowledgementPacket";

export class ACK extends AcknowledgementPacket {

    constructor(stream?){
        super();
        if (stream){
            this.stream = stream;
        }
    }

    static getId(): any {
        return 0xc0;
    }
}