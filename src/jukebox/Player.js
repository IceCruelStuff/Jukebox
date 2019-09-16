"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Human_1 = require("./entity/Human");
const TextFormat_1 = require("./utils/TextFormat");
const PlayerSessionAdapter_1 = require("./network/PlayerSessionAdapter");
const ResourcePackClientResponsePacket_1 = require("./network/mcpe/protocol/ResourcePackClientResponsePacket");
const Skin_1 = require("./entity/Skin");
const Base64_1 = require("./utils/Base64");
const PlayStatusPacket_1 = require("./network/mcpe/protocol/PlayStatusPacket");
const ResourcePacksInfoPacket_1 = require("./network/mcpe/protocol/ResourcePacksInfoPacket");
const ResourcePackDataInfoPacket_1 = require("./network/mcpe/protocol/ResourcePackDataInfoPacket");
const ResourcePackStackPacket_1 = require("./network/mcpe/protocol/ResourcePackStackPacket");
const Vector3_1 = require("./math/Vector3");
const StartGamePacket_1 = require("./network/mcpe/protocol/StartGamePacket");
const LevelChunkPacket_1 = require("./network/mcpe/protocol/LevelChunkPacket");
const ChunkRadiusUpdatedPacket_1 = require("./network/mcpe/protocol/ChunkRadiusUpdatedPacket");
/**
 * Main class that handles networking, recovery, and packet sending to the server part
 */
class Player extends Human_1.Human {
    constructor(server, clientId, ip, port) {
        super();
        this.needACK = [];
        this.batchedPackets = [];
        /**
         *  Last measurement of player's latency in milliseconds.
         */
        this.lastPingMeasure = 1;
        this.creationTime = 0;
        this.loggedIn = false;
        this.spawned = false;
        this.username = "";
        this.iusername = "";
        this.displayName = "";
        this.xuid = "";
        this.windowCnt = 2;
        this.windows = [];
        this.windowIndex = []; //TODO
        this.permanentWindows = [];
        this.craftingGrid = null; //TODO
        this.craftingTransaction = null; //TODO
        this.messageCounter = 2;
        this.removeFormat = true;
        this.achievements = [];
        this.loaderId = 0;
        this.usedChunks = [];
        this.loadQueue = [];
        this.nextChunkOrderRun = 5;
        this.viewDistance = -1;
        this.spawnChunkLoadCount = 0;
        this.hiddenPlayers = [];
        this.isTeleporting = false;
        this.inAirTicks = 0;
        this.stepHeight = 0.6;
        this.allowMovementCheats = false;
        this.sleeping = null;
        this.spawnPosition = null;
        //TODO: Abilities
        this.autoJump = true;
        this.allowFlight = false;
        this.flying = false;
        this.perm = null; //TODO
        this.lineHeight = null;
        this.locale = "en_US";
        this.startAction = -1;
        this.usedItemsCooldown = [];
        this.formIdCounter = 0;
        this.forms = []; //TODO
        this.lastRightClickTime = 0.0;
        this.lastRightClickPos = null; //TODO
        this.server = server;
        this.randomClientId = clientId;
        this.ip = ip;
        this.port = port;
        this.creationTime = Date.now();
        this.sessionAdapter = new PlayerSessionAdapter_1.PlayerSessionAdapter(this);
    }
    /**
     * Validates the given username.
     *
     * @param name {string}
     *
     * @return {boolean}
     */
    static isValidUserName(name) {
        if (name == null) {
            return false;
        }
        return name.toLowerCase() !== "rcon" && name.toLowerCase() !== "console" && name.length >= 1 && name.length <= 16 && /[^A-Za-z0-9_ ]/.test(name);
    }
    getLeaveMessage() {
        if (this.spawned) {
            return TextFormat_1.TextFormat.YELLOW + this.getName() + " has left the game";
        }
        return "";
    }
    /**
     * This might disappear in the future. Please use getUniqueId() instead.
     * @deprecated
     *
     */
    getClientId() {
        return this.randomClientId;
    }
    isBanned() {
        return false; //TODO
        // this.server.getNameBans().isBanned(this.username);
    }
    setBanned(value) {
        //TODO
        if (value) {
            // this.server.getNameBans().addBan(this.getName(), null, null, null);
            // this.kick("You have been banned");
        }
        else {
            // this.server.getNameBans().remove(this.getName());
        }
    }
    isWhitelisted() {
        return true;
        //TODO
        // return this.server.isWhitelisted(this.username);
    }
    /**
     * @param value {boolean}
     */
    setWhitelisted(value) {
        //TODO
        if (value) {
            // this.server.addWhitelist(this.username);
        }
        else {
            // this.server.removeWhitelist(this.username);
        }
    }
    getScreenLineHeight() {
        return this.lineHeight || 7;
    }
    setScreenLineHeight(height = null) {
        if (height !== null && height < 1) {
            throw new Error("Line height must be at least 1");
        }
        this.lineHeight = height;
    }
    isPermissionSet(name) {
        return this.perm.isPermissionSet(name);
    }
    hasPermission(name) {
        if (this.closed) {
            throw new Error("Trying to get permissions of closed player");
        }
        return this.perm.hasPermission(name);
    }
    addAttachment() {
        //TODO
    }
    close(message, reason = "generic reason", notify = true) {
        if (this.isConnected() && !this.closed) {
            try {
                if (notify && reason.length > 0) {
                    // let pk = new DisconnectPacket();
                    // pk.message = reason;
                    // this.dataPacket(pk);
                    //TODO: fix. this.directDataPacket(pk);
                }
                this.sessionAdapter = null;
                //unsub from perms?
                //stopsleep
                if (this.spawned) {
                    try {
                        //save player data
                    }
                    catch (e) {
                        this.server.getLogger().error("Failed to save player data for " + this.getName());
                        this.server.getLogger().logError(e);
                    }
                    //tell server player left the game
                }
                // this.joined = false;
                //if valid do chuck stuff
                if (this.loggedIn) {
                    // this.server.onPlayerLogout(this);
                    //can see etc
                }
                this.spawned = false;
                // let ev = new PlayerQuitEvent(this, "A Player quit due to " + reason, reason);
                // this.server.getEventSystem().callEvent(ev);
                // if(ev.getQuitMessage().length > 0){
                //     let message = ev.getQuitMessage();
                //     this.server.broadcastMessage(message);
                // } else {
                //     this.server.getLogger().warning("Player quit message is blank or null.");
                // }
                this.server.getLogger().info(TextFormat_1.TextFormat.AQUA + this.getName() + TextFormat_1.TextFormat.WHITE + " (" + this.ip + ":" + this.port + ") has disconnected due to " + reason);
                if (this.loggedIn) {
                    this.loggedIn = false;
                    // this.server.removeOnlinePlayer(this);
                }
            }
            catch (e) {
                this.server.getLogger().logError(e);
            }
            finally {
                // this.server.getRakNetAdapter().close(this, notify ? reason : "");
                // this.server.removePlayer(this);
            }
        }
    }
    handleLogin(packet) {
        if (this.loggedIn) {
            return false;
        }
        this.username = TextFormat_1.TextFormat.clean(packet.username);
        this.displayName = this.username;
        this.iusername = this.username.toLowerCase();
        if (packet.locale !== null) {
            this.locale = packet.locale;
        }
        //TODO: check if server is full anc kick player...
        this.randomClientId = packet.clientId;
        //TODO: uuid
        let skin = new Skin_1.Skin(packet.clientData["SkinId"], Base64_1.Base64.decode(packet.clientData["SkinData"] || ""), Base64_1.Base64.decode(packet.clientData["CapeData"] || ""), packet.clientData["SkinGeometryName"] || "", Base64_1.Base64.decode(packet.clientData["SkinGeometry"] || ""));
        if (!skin.isValid()) {
            this.close("", "disconnection.invalidSkin");
            return true;
        }
        this.setSkin(skin);
        this.onVerifyCompleted(packet, null, true);
        return true;
    }
    onVerifyCompleted(packet, error, signedByMojang) {
        if (this.closed) {
            return;
        }
        if (error !== null) {
            this.close("", "Invalid Session");
            return;
        }
        let xuid = packet.xuid;
        if (!signedByMojang && xuid !== "") {
            this.server.getLogger().info(this.getName() + " has an XUID, but their login keychain is not signed by Mojang");
            xuid = "";
        }
        // @ts-ignore
        if (xuid === "" || !xuid instanceof String) {
            if (signedByMojang) {
                this.server.getLogger().error(this.getName() + " should have an XUID, but none found");
            }
            if (this.server.requiresAuthentication() && this.kick("This server requires authentication.", false)) {
                return;
            }
            this.server.getLogger().debug(this.getName() + " is NOT logged into Xbox Live");
        }
        else {
            this.server.getLogger().debug(this.getName() + " is logged into Xbox Live");
            this.xuid = xuid;
        }
        //TODO: encryption
        this.processLogin();
    }
    processLogin() {
        for (let [, p] of this.server.loggedInPlayers) {
            if (p !== this && p.iusername === this.iusername) {
                if (p.kick("Logged in from another location") === false) {
                    this.close(this.getLeaveMessage(), "Logged in from another location");
                    return;
                }
            }
            else if (p.loggedIn /* && uuids equal*/) {
                if (p.kick("Logged in from another location") === false) {
                    this.close(this.getLeaveMessage(), "Logged in from another location");
                    return;
                }
            }
        }
        this.sendPlayStatus(PlayStatusPacket_1.PlayStatusPacket.LOGIN_SUCCESS);
        this.loggedIn = true;
        this.server.onPlayerLogin(this);
        console.log("Player logged in: " + this.username);
        let pk = new ResourcePacksInfoPacket_1.ResourcePacksInfoPacket();
        let manager = this.server.getResourcePackManager();
        pk.resourcePackEntries = manager.getResourcePacks();
        pk.mustAccept = manager.resourcePacksRequired();
        this.dataPacket(pk);
    }
    chat(message) {
        //TODO: if is alive.
        if (!this.spawned) {
            return false;
        }
        message = TextFormat_1.TextFormat.clean(message, this.removeFormat);
        message.split("\n").forEach(messagePart => {
            if (messagePart.trim() !== "" && messagePart.length <= 255 && this.messageCounter-- > 0) {
                if (messagePart.startsWith("./")) {
                    messagePart = messagePart.substr(1);
                }
                //TODO: call PlayerCommandPreprocessEvent
                if (messagePart.startsWith("/")) {
                    //TODO: dispatch command
                }
                else {
                    let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messagePart);
                    this.server.getLogger().info(msg);
                    this.server.broadcastMessage(msg);
                }
            }
        });
    }
    kick(reason = "", isAdmin = true) {
        let message;
        if (isAdmin) {
            if (true) { //todo: not is banned
                message = "Kicked by admin." + (reason !== "" ? " Reason: " + reason : "");
            }
            else {
                message = reason;
            }
        }
        else {
            if (reason === "") {
                message = "Unknown Reason.";
            }
            else {
                message = reason;
            }
        }
        this.close(reason, message);
        return true;
    }
    sendPlayStatus(status, immediate = false) {
        let pk = new PlayStatusPacket_1.PlayStatusPacket();
        pk.status = status;
        if (immediate) {
            this.directDataPacket(pk);
        }
        else {
            this.dataPacket(pk);
        }
    }
    directDataPacket(packet, needACK = false) {
        return this.sendDataPacket(packet, needACK, true);
    }
    /*handlePacket(pid){
        switch (pid) {
            case 0x01:
                console.log("works");
                break;

        }
    }*/
    //TODO: future update packet 
    handleResourcePackClientResponse(packet) {
        console.log("Got a new resource pack response with status: " + packet.status);
        let pk, manager;
        console.log("Status:", ResourcePackClientResponsePacket_1.ResourcePackClientResponsePacket.STATUS(packet.status));
        switch (packet.status) {
            case ResourcePackClientResponsePacket_1.ResourcePackClientResponsePacket.STATUS_REFUSED:
                this.close("", "You must accept resource packs to join this server.", true);
                break;
            case ResourcePackClientResponsePacket_1.ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
                manager = this.server.getResourcePackManager();
                packet.packIds.forEach(uuid => {
                    //dirty hack for mojang's dirty hack for versions
                    let slitPos = uuid.indexOf("_");
                    if (slitPos !== false) {
                        uuid = uuid.slice(uuid, 0, slitPos);
                    }
                    let pack = manager.getPackById(uuid);
                    // @ts-ignore
                    if (!(pack instanceof ResourcePack)) {
                        this.close("", "Resource Pack is not on this server", true);
                        console.log("Got a resource pack request for unknown pack with UUID " + uuid + ", available packs: " + manager.getPackIdList().join(", "));
                        return false;
                    }
                    let pk = new ResourcePackDataInfoPacket_1.ResourcePackDataInfoPacket();
                    pk.packId = pack.getPackId();
                    pk.maxChunkSize = 1048576;
                    pk.chunkCount = Math.ceil(pack.getPackSize() / pk.maxChunkSize);
                    pk.compressedPackSize = pack.getPackSize();
                    pk.sha256 = pack.getSha256();
                    this.dataPacket(pk);
                });
                break;
            case ResourcePackClientResponsePacket_1.ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
                pk = new ResourcePackStackPacket_1.ResourcePackStackPacket();
                manager = this.server.getResourcePackManager();
                pk.resourcePackStack = manager.getResourcePacks();
                pk.mustAccept = manager.resourcePacksRequired();
                this.dataPacket(pk);
                break;
            case ResourcePackClientResponsePacket_1.ResourcePackClientResponsePacket.STATUS_COMPLETED:
                this.completeLoginSequence();
                break;
            default:
                return false;
        }
        return true;
    }
    completeLoginSequence() {
        // let pos = this.namedtag.getListTag("Pos").getAllValues();
        // this.usedChunks[Level.chunkHash(pos[0] >> 4, pos[2]) >> 4] = false;
        //create entity
        this.server.getLogger().info([
            TextFormat_1.TextFormat.AQUA + this.getName() + TextFormat_1.TextFormat.WHITE + " (" + this.ip + ":" + this.port + ")",
            "is attempting to join"
        ].join(" "));
        let pk = new StartGamePacket_1.StartGamePacket();
        pk.entityUniqueId = this.id;
        pk.entityRuntimeId = this.id;
        pk.playerGamemode = Player.getClientFriendlyGamemode(this.gamemode);
        pk.playerPosition = new Vector3_1.Vector3(0, 5.5, 0);
        pk.pitch = this.pitch;
        pk.yaw = this.yaw;
        pk.seed = 0xdeadbeef;
        pk.dimension = 0; //TODO
        pk.worldGamemode = 1; //this.server.getGamemode();
        pk.difficulty = 1; //TODO
        [pk.spawnX, pk.spawnY, pk.spawnZ] = [0, 6.5, 0];
        pk.hasAchievementsDisabled = true;
        pk.time = 0;
        pk.eduMode = false;
        pk.rainLevel = 0;
        pk.lightningLevel = 0;
        pk.commandsEnabled = true;
        pk.levelId = "";
        pk.worldName = "test"; //this.server.getMotd();
        this.dataPacket(pk);
        // this.sendDataPacket(new AvailableActorIdentifiersPacket());
        // this.sendDataPacket(new BiomeDefinitionListPacket());
        // this.level.sendTime(this);
        // this.sendAttributes(true);
        // this.sendCommandData();
        // this.sendSettings();
        // this.sendPotionEffects(this);
        // this.sendData(this);
        // this._sendAllInventories();
        this.server.addOnlinePlayer(this);
        // this.server.onPlayerCompleteLoginSequence(this);
        //this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);
        // let ev = new PlayerJoinEvent(this, TextFormat.YELLOW + this.getName() + " Joined the game!");
        // this.server.getPluginManager().callEvent(ev);
        // if(ev.getJoinMessage().length > 0){
        //     this.server.broadcastMessage(ev.getJoinMessage());
        // } else {
        //     this.server.getLogger().warning("Player join message is blank or null.");
        // }
    }
    doFirstSpawn() {
        this.spawned = true;
        this.sendPlayStatus(PlayStatusPacket_1.PlayStatusPacket.PLAYER_SPAWN);
    }
    sendChunk(chunk) {
        let pk = new LevelChunkPacket_1.LevelChunkPacket();
        pk.chunkX = chunk.getX();
        pk.chunkZ = chunk.getZ();
        pk.subChunkCount = chunk.getSubChunkSendCount();
        pk.cacheEnabled = false;
        pk.extraPayload = "";
        this.dataPacket(pk);
        if (this.spawned === false) {
            this.doFirstSpawn();
        }
    }
    setViewDistance(distance) {
        this.viewDistance = distance;
        let pk = new ChunkRadiusUpdatedPacket_1.ChunkRadiusUpdatedPacket();
        pk.radius = this.viewDistance;
        this.dataPacket(pk);
        console.log("Setting view distance for " + this.getName() + " to " + distance);
    }
    getViewDistance() {
        return this.viewDistance;
    }
    static getClientFriendlyGamemode(gamemode) {
        gamemode &= 0x03;
        if (gamemode === Player.SPECTATOR) {
            return Player.CREATIVE;
        }
        return gamemode;
    }
    getLowerCaseName() {
        return this.iusername;
    }
    /**
     * @return {boolean}
     */
    isAuthenticated() {
        return this.xuid !== "";
    }
    /**
     * If the player is logged into Xbox Live, returns their Xbox user ID (XUID) as a string. Returns an empty string if
     * the player is not logged into Xbox Live.
     */
    getXuid() {
        return this.xuid;
    }
    /**
     * Returns the player's UUID. This should be preferred over their Xbox user ID (XUID) because UUID is a standard
     * format which will never change, and all players will have one regardless of whether they are logged into Xbox
     * Live.
     *
     * The UUID is comprised of:
     * - when logged into XBL: a hash of their XUID (and as such will not change for the lifetime of the XBL account)
     * - when NOT logged into XBL: a hash of their name + clientID + secret device ID.
     *
     * WARNING: UUIDs of players **not logged into Xbox Live** CAN BE FAKED and SHOULD NOT be trusted!
     *
     * (In the olden days this method used to return a fake UUID computed by the server, which was used by plugins such
     * as SimpleAuth for authentication. This is NOT SAFE anymore as this UUID is now what was given by the client, NOT
     * a server-computed UUID.)
     */
    getUniqueId() {
        return super.getUniqueId();
    }
    getPlayer() {
        return this;
    }
    getFirstPlayed() {
        //TODO
        return null;
    }
    getLastPlayed() {
        //TODO
        return null;
    }
    hasPlayedBefore() {
        return true;
        //TODO
    }
    isOnline() {
        return this.isConnected() && this.loggedIn;
    }
    isOp() {
        return true;
        //TODO
    }
    setOp(value) {
        return true;
        //TODO
    }
    /**
     * @return {boolean}
     */
    isConnected() {
        return this.sessionAdapter !== null;
    }
    sendMessage(message) {
        //TODO
    }
    getServer() {
        return this.server;
    }
    dataPacket(packet, needACK = false) {
        return this.sendDataPacket(packet, needACK, false);
    }
    sendDataPacket(packet, needACK = false, immediate = false) {
        if (!this.isConnected())
            return false;
        if (!this.loggedIn && !packet.canBeSentBeforeLogin()) {
            throw new Error("Attempted to send " + packet.getName() + " to " + this.getName() + " before they got logged in.");
        }
        // let ev = new DataPacketSendEvent(this, packet);
        // this.server.getPluginManager().callEvent(ev);
        // if(ev.isCancelled()){
        //     return false;
        // }
        let identifier = this.getSessionAdapter().sendPacket(packet, needACK, immediate);
        if (needACK && identifier !== null) {
            this.needACK[identifier] = false;
            return identifier;
        }
        return true;
    }
    getSessionAdapter() {
        return this.sessionAdapter;
    }
    /**
     * Gets the username
     * @return {string}
     */
    getName() {
        return this.username;
    }
    getLoaderId() {
        return this.loaderId;
    }
    isLoaderActive() {
        return this.isConnected();
    }
}
exports.Player = Player;
Player.SURVIVAL = 0;
Player.CREATIVE = 1;
Player.ADVENTURE = 2;
Player.SPECTATOR = 3;
Player.VIEW = Player.SPECTATOR;
//# sourceMappingURL=Player.js.map