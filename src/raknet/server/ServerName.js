"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerName {
    constructor() {
        this.players = {
            online: 0,
            max: 20
        };
    }
    getMotd() {
        return this.motd;
    }
    setMotd(motd) {
        this.motd = motd;
        return this;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    getProtocol() {
        return this.protocol;
    }
    setProtocol(protocol) {
        this.protocol = protocol;
        return this;
    }
    getVersion() {
        return this.version;
    }
    setVersion(version) {
        this.version = version;
        return this;
    }
    getOnlinePlayers() {
        return this.players.online;
    }
    setOnlinePlayers(online) {
        this.players.online = online;
        return this;
    }
    getMaxPlayers() {
        return this.players.max;
    }
    setMaxPlayers(max) {
        this.players.max = max;
        return this;
    }
    getGamemode() {
        return this.gamemode;
    }
    setGamemode(gamemode) {
        this.gamemode = gamemode;
        return this;
    }
    getServerId() {
        return this.serverId;
    }
    setServerId(serverId) {
        this.serverId = serverId;
        return this;
    }
    toString() {
        return [
            "MCPE",
            this.motd,
            this.protocol,
            this.version,
            this.players.online,
            this.players.max,
            this.serverId,
            this.name,
            this.gamemode
        ].join(";") + ";";
    }
}
exports.ServerName = ServerName;
//# sourceMappingURL=ServerName.js.map