import {UnconnectedPing} from "../protocol/UnconnectedPing";
import {OpenConnectionRequest1} from "../protocol/OpenConnectionRequest1";
import {OpenConnectionRequest2} from "../protocol/OpenConnectionRequest2";

export class PacketPool extends Map {

    constructor(){
        super();
        this.registerPackets();
    }

    registerPacket(packet): void{
        this.set(packet.getId(), packet);
    }

    getPacket(id): any{
        return this.has(id) ? this.get(id) : null;
    }

    registerPackets(): void{
        this.registerPacket(UnconnectedPing);
        this.registerPacket(OpenConnectionRequest1);
        this.registerPacket(OpenConnectionRequest2);
    }
}
