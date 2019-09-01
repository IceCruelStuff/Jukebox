"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = require("dgram");
class UDPServerSocket {
    constructor(port, logger) {
        this.socket = dgram.createSocket("udp4");
        this.socket.on("error", err => {
            logger.error(err);
            this.close();
        });
        this.socket.bind(port);
    }
    getSocket() {
        return this.socket;
    }
    sendBuffer(buffer, address, port) {
        return this.getSocket().send(buffer, 0, buffer.length, port, address);
    }
    close() {
        this.socket.close();
    }
}
exports.UDPServerSocket = UDPServerSocket;
//# sourceMappingURL=UDPServerSocket.js.map