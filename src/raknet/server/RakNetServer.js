"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UDPServerSocket_1 = require("./UDPServerSocket");
const SessionManager_1 = require("./SessionManager");
const ServerName_1 = require("./ServerName");
const PacketPool_1 = require("./PacketPool");
class RakNetServer {
    constructor(port, logger) {
        this._shutdown = false;
        this.serverName = new ServerName_1.ServerName();
        this.packetPool = new PacketPool_1.PacketPool();
        if (port < 1 || port > 65536) {
            throw new Error("Invalid port range");
        }
        this.port = port;
        this.logger = logger;
        this.server = new UDPServerSocket_1.UDPServerSocket(port, logger);
        this.sessionManager = new SessionManager_1.SessionManager(this, this.server);
    }
    /*isShutdown(){
        return this._shutdown === true;
    }*/
    shutdown() {
        this._shutdown = true;
    }
    getPort() {
        return this.port;
    }
    getServerName() {
        return this.serverName;
    }
    getLogger() {
        return this.logger;
    }
    getId() {
        return this.getServerName().getServerId();
    }
    getSessionManager() {
        return this.sessionManager;
    }
}
exports.RakNetServer = RakNetServer;
//# sourceMappingURL=RakNetServer.js.map