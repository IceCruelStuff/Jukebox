import {Logger} from "../../jukebox/logger/Logger";
import {UDPServerSocket} from "./UDPServerSocket";
import {SessionManager} from "./SessionManager";
import {ServerName} from "./ServerName";
import {PacketPool} from "./PacketPool";

export class RakNetServer{

    private readonly port: number;
    private readonly logger: Logger;

    private _shutdown: boolean = false;

    private readonly server: UDPServerSocket;
    private readonly sessionManager: SessionManager;

    private readonly serverName: ServerName;
    private readonly packetPool: PacketPool;

    constructor(port: number, logger: Logger){

        this.serverName = new ServerName();
        this.packetPool = new PacketPool();

        if (port < 1 || port > 65536){
            throw new Error("Invalid port range");
        }

        this.port = port;
        this.logger = logger;

        this.server = new UDPServerSocket(port, logger);
        this.sessionManager = new SessionManager(this, this.server);
    }

    /*isShutdown(){
        return this._shutdown === true;
    }*/

    shutdown(): void{
        this._shutdown = true;
    }

    getPort(): number{
        return this.port;
    }

    getServerName(){
        return this.serverName;
    }

    getLogger(){
        return this.logger;
    }

    getId(){
        return this.getServerName().getServerId();
    }

    getSessionManager(){
        return this.sessionManager;
    }

    /*getPacketPool(){
        return this.packetPool;
    }*/
}