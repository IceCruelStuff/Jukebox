import {Logger} from "../../jukebox/logger/Logger";
import * as dgram from "dgram";

export class UDPServerSocket {

    private readonly socket: any;

    constructor(port: number, logger: Logger){
        this.socket = dgram.createSocket("udp4");

        this.socket.on("error", err => {
           logger.error(err);
           this.close();
        });

        this.socket.bind(port);
    }

    getSocket(): any{
        return this.socket;
    }

    sendBuffer(buffer, address: string, port: number): void{
        return this.getSocket().send(buffer, 0, buffer.length, port, address);
    }

    close(): void{
        this.socket.close();
    }
}