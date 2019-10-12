import {Human} from "./entity/Human";
import {CommandSender} from "./command/CommandSender";
import {IPlayer} from "./IPlayer";
import {DataPacket} from "./network/mcpe/protocol/DataPacket";
import {TextFormat} from "./utils/TextFormat";
import {JukeboxServer} from "./JukeboxServer";
import {PlayerSessionAdapter} from "./network/PlayerSessionAdapter";
import {ResourcePackClientResponsePacket} from "./network/mcpe/protocol/ResourcePackClientResponsePacket";
import {ResourcePack} from "./resourcepacks/ResourcePack";
import {LoginPacket} from "./network/mcpe/protocol/LoginPacket";
import {Skin} from "./entity/Skin";
import {Base64} from "./utils/Base64";
import {PlayStatusPacket} from "./network/mcpe/protocol/PlayStatusPacket";
import {ResourcePacksInfoPacket} from "./network/mcpe/protocol/ResourcePacksInfoPacket";
import {ResourcePackDataInfoPacket} from "./network/mcpe/protocol/ResourcePackDataInfoPacket";
import {ResourcePackStackPacket} from "./network/mcpe/protocol/ResourcePackStackPacket";
import {GameRule} from "./level/GameRule";
import {Vector3} from "./math/Vector3";
import {StartGamePacket} from "./network/mcpe/protocol/StartGamePacket";
import {LevelChunkPacket} from "./network/mcpe/protocol/LevelChunkPacket";
import {ChunkRadiusUpdatedPacket} from "./network/mcpe/protocol/ChunkRadiusUpdatedPacket";
import {TextPacket} from "./network/mcpe/protocol/TextPacket";
import {Chunk} from "./level/format/Chunk";

/**
 * Main class that handles networking, recovery, and packet sending to the server part
 */
export class Player extends Human implements CommandSender, ChunkLoader, IPlayer{

    static readonly SURVIVAL = 0;
    static readonly CREATIVE = 1;
    static readonly ADVENTURE = 2;
    static readonly SPECTATOR = 3;
    static readonly VIEW = Player.SPECTATOR;

    /**
     * Validates the given username.
     *
     * @param name {string}
     *
     * @return {boolean}
     */
    static isValidUserName(name){
        if (name == null){
            return false;
        }

        return name.toLowerCase() !== "rcon" && name.toLowerCase() !== "console" && name.length >= 1 && name.length <= 16 && /[^A-Za-z0-9_ ]/.test(name);
    }

    protected interface;

    protected sessionAdapter: PlayerSessionAdapter;

    protected ip: string;
    protected port: number;

    private needACK: boolean[] = [];

    private batchedPackets: DataPacket[] = [];

    /**
     *  Last measurement of player's latency in milliseconds.
     */
    protected lastPingMeasure: number = 1;

    public creationTime: number = 0;

    public loggedIn: boolean = false;

    public spawned: boolean = false;

    protected username: string = "";
    protected iusername: string = "";
    protected displayName: string = "";
    protected randomClientId: number;
    protected xuid: string = "";

    protected windowCnt: number = 2;
    protected windows: number[] = [];
    protected windowIndex = []; //TODO
    protected permanentWindows: boolean[]  = [];
    protected cursorInventory; //TODO
    protected craftingGrid = null; //TODO
    protected craftingTransaction = null; //TODO

    protected messageCounter: number = 2;
    protected removeFormat: boolean = true;

    protected achievements = [];
    protected playedBefore: boolean;
    protected gamemode: number;

    private loaderId: number = 0;
    public usedChunks = [];
    protected loadQueue = [];
    protected nextChunkOrderRun: number = 5;

    protected viewDistance: number = -1;
    protected spawnThreshold: number;
    protected spawnChunkLoadCount: number = 0;
    protected chunksPerTick: number;

    protected hiddenPlayers = [];

    protected newPosition;
    protected isTeleporting: boolean = false;
    protected inAirTicks: number = 0;
    protected stepHeight: number = 0.6;
    protected allowMovementCheats: boolean = false;

    protected sleeping = null;
    private spawnPosition = null;

    //TODO: Abilities
    protected autoJump: boolean = true;
    protected allowFlight: boolean = false;
    protected flying: boolean = false;

    private perm = null; //TODO

    protected lineHeight: number|null = null;
    protected locale: string = "en_US";

    protected startAction: number = -1;
    protected usedItemsCooldown = [];

    protected formIdCounter: number = 0;
    protected forms = []; //TODO

    protected lastRightClickTime: number = 0.0;
    protected lastRightClickPos = null; //TODO

    getLeaveMessage(): string{
        if(this.spawned){
            return TextFormat.YELLOW + this.getName() + " has left the game";
        }
        return "";
    }

    /**
     * This might disappear in the future. Please use getUniqueId() instead.
     * @deprecated
     *
     */
    getClientId(){
        return this.randomClientId;
    }

    isBanned(): boolean{
        return false; //TODO
        // this.server.getNameBans().isBanned(this.username);
    }

    setBanned(value: boolean) {
        //TODO
        if (value){
            // this.server.getNameBans().addBan(this.getName(), null, null, null);
            // this.kick("You have been banned");
        }else{
            // this.server.getNameBans().remove(this.getName());
        }
    }

    isWhitelisted(): boolean{
        return true;
        //TODO
        // return this.server.isWhitelisted(this.username);
    }

    /**
     * @param value {boolean}
     */
    setWhitelisted(value){
        //TODO
        if(value){
            // this.server.addWhitelist(this.username);
        }else {
            // this.server.removeWhitelist(this.username);
        }
    }

    getScreenLineHeight(): number {
        return this.lineHeight || 7;
    }

    setScreenLineHeight(height: number = null) {
        if (height !== null && height < 1){
            throw new Error("Line height must be at least 1");
        }
        this.lineHeight = height;
    }

    isPermissionSet(name: string): boolean {
        return this.perm.isPermissionSet(name);
    }
    
    hasPermission(name: string): boolean {
        if (this.closed) {
            throw new Error("Trying to get permissions of closed player");
        }
        return this.perm.hasPermission(name);
    }

    addAttachment() {
        //TODO
    }

    close(message, reason = "generic reason", notify = true){
        if(this.isConnected() && !this.closed){
            try{
                if(notify && reason.length > 0){
                    // let pk = new DisconnectPacket();
                    // pk.message = reason;
                    // this.dataPacket(pk);
                    //TODO: fix. this.directDataPacket(pk);
                }

                this.sessionAdapter = null;

                //unsub from perms?
                //stopsleep

                if(this.spawned){
                    try{
                        //save player data
                    }catch(e){
                        this.server.getLogger().error("Failed to save player data for "+this.getName());
                        this.server.getLogger().logError(e);
                    }

                    //tell server player left the game
                }
                // this.joined = false;

                //if valid do chuck stuff

                if(this.loggedIn){
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

                this.server.getLogger().info(TextFormat.AQUA + this.getName() + TextFormat.WHITE + " (" + this.ip + ":" + this.port + ") has disconnected due to " + reason);

                if(this.loggedIn){
                    this.loggedIn = false;
                    // this.server.removeOnlinePlayer(this);
                }
            }catch(e){
                this.server.getLogger().logError(e);
            }finally{
                // this.server.getRakNetAdapter().close(this, notify ? reason : "");
                // this.server.removePlayer(this);
            }
        }
    }

    handleLogin(packet: LoginPacket): boolean{
        if (this.loggedIn){
            return false;
        }

        this.username = TextFormat.clean(packet.username);
        this.displayName = this.username;
        this.iusername = this.username.toLowerCase();

        if (packet.locale !== null){
            this.locale = packet.locale;
        }

        //TODO: check if server is full anc kick player...

        this.randomClientId = packet.clientId;

        //TODO: uuid

        let skin = new Skin(
          packet.clientData["SkinId"],
          Base64.decode(packet.clientData["SkinData"] || ""),
          Base64.decode(packet.clientData["CapeData"] || ""),
          packet.clientData["SkinGeometryName"] || "",
          Base64.decode(packet.clientData["SkinGeometry"] || "")
        );

        if (!skin.isValid()){
            this.close("", "disconnection.invalidSkin");

            return true;
        }

        this.setSkin(skin);

        this.onVerifyCompleted(packet, null, true);

        return true;
    }

    onVerifyCompleted(packet: LoginPacket, error: string, signedByMojang: boolean){
        if(this.closed) {
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
        if (xuid === "" || !xuid instanceof String){
            if (signedByMojang){
                this.server.getLogger().error(this.getName() + " should have an XUID, but none found");
            }

            if(this.server.requiresAuthentication() && this.kick("This server requires authentication.", false)){
                return;
            }

            this.server.getLogger().debug(this.getName() + " is NOT logged into Xbox Live");
        }else {
            this.server.getLogger().debug(this.getName() + " is logged into Xbox Live");
            this.xuid = xuid;
        }

        //TODO: encryption

        this.processLogin();
    }

    protected processLogin(){
        for(let [,p] of this.server.loggedInPlayers){
            if(p !== this && p.iusername === this.iusername){
                if(p.kick("Logged in from another location") === false){
                    this.close(this.getLeaveMessage(), "Logged in from another location");
                    return;
                }
            }else if(p.loggedIn/* && uuids equal*/){
                if(p.kick("Logged in from another location") === false){
                    this.close(this.getLeaveMessage(), "Logged in from another location");
                    return;
                }
            }
        }

        this.sendPlayStatus(PlayStatusPacket.LOGIN_SUCCESS);

        this.loggedIn = true;
        this.server.onPlayerLogin(this);
        console.log("Player logged in: " + this.username);

        let pk = new ResourcePacksInfoPacket();
        let manager = this.server.getResourcePackManager();
        pk.resourcePackEntries = manager.getResourcePacks();
        pk.mustAccept = manager.resourcePacksRequired();
        this.dataPacket(pk);
    }

    chat(message: string): boolean{
        //TODO: if is alive.
        if (!this.spawned){
            return false;
        }

        message = TextFormat.clean(message, this.removeFormat);
        message.split("\n").forEach(messagePart => {
            if (messagePart.trim() !== "" && messagePart.length <= 255 && this.messageCounter-- > 0){
                if (messagePart.startsWith("./")){
                    messagePart = messagePart.substr(1);
                }

                //TODO: call PlayerCommandPreprocessEvent

                if (messagePart.startsWith("/")){
                    //TODO: dispatch command
                }else {
                    let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messagePart);
                    this.server.getLogger().info(msg);
                    this.server.broadcastMessage(msg);
                }
            }
        });
    }

    kick(reason = "", isAdmin = true): boolean{
        let message;
        if(isAdmin){
            if(true){//todo: not is banned
                message = "Kicked by admin." + (reason !== "" ? " Reason: " + reason : "");
            }else{
                message = reason;
            }
        }else{
            if(reason === ""){
                message = "Unknown Reason.";
            }else{
                message = reason;
            }
        }

        this.close(reason, message);
        return true;
    }

    sendPlayStatus(status: number, immediate: boolean = false){
        let pk = new PlayStatusPacket();
        pk.status = status;
        if(immediate){
            this.directDataPacket(pk);
        }else{
            this.dataPacket(pk);
        }
    }

    directDataPacket(packet, needACK = false){
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

    handleResourcePackClientResponse(packet: ResourcePackClientResponsePacket){
        let pk, manager;
        switch(packet.status){
            case ResourcePackClientResponsePacket.STATUS_REFUSED:
                //TODO: add lang strings for this
                this.close("", "You must accept resource packs to join this server.", true);
                break;
            case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
                manager = this.server.getResourcePackManager();
                packet.packIds.forEach(uuid => {
                    //dirty hack for mojang's dirty hack for versions
                    let slitPos = uuid.indexOf("_");
                    if (slitPos !== false){
                        uuid = uuid.slice(uuid, 0, slitPos);
                    }

                    let pack = manager.getPackById(uuid);
                    if (!(pack instanceof ResourcePack)){
                        this.close("", "Resource Pack is not on this server", true);
                        this.server.getLogger().debug("Got a resource pack request for unknown pack with UUID " + uuid + ", available packs: " + manager.getPackIdList().join(", "));

                        return false;
                    }

                    let pk = new ResourcePackDataInfoPacket();
                    pk.packId = pack.getPackId();
                    pk.maxChunkSize = 1048576; //1MB
                    pk.chunkCount = Number(Math.ceil(pack.getPackSize() / pk.maxChunkSize));
                    pk.compressedPackSize = pack.getPackSize();
                    pk.sha256 = pack.getSha256();
                    this.dataPacket(pk);
                });

                break;
            case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
                pk = new ResourcePackStackPacket();
                manager = this.server.getResourcePackManager();
                pk.resourcePackStack = manager.getResourcePacks();
                pk.mustAccept = manager.resourcePacksRequired();
                this.dataPacket(pk);
                break;
            case ResourcePackClientResponsePacket.STATUS_COMPLETED:
                this.completeLoginSequence();
                break;
            default:
                return false;
        }

        return true;
    }

    protected completeLoginSequence(){

        // let pos = this.namedtag.getListTag("Pos").getAllValues();
        // this.usedChunks[Level.chunkHash(pos[0] >> 4, pos[2]) >> 4] = false;

        //create entity
        this.server.getLogger().info([
            TextFormat.AQUA + this.getName() + TextFormat.WHITE + " (" + this.ip + ":" + this.port + ")",
            "is attempting to join"
        ].join(" "));

        let pk = new StartGamePacket();
        pk.entityUniqueId = this.id;
        pk.entityRuntimeId = this.id;
        pk.playerGamemode = Player.getClientFriendlyGamemode(this.gamemode);

        pk.playerPosition = new Vector3(0, 5.5, 0);

        pk.pitch = this.pitch;
        pk.yaw = this.yaw;
        pk.seed = 0xdeadbeef;
        pk.dimension = 0; //TODO
        pk.worldGamemode = 1;//this.server.getGamemode();
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

    doFirstSpawn(): void{
        this.spawned = true;

        this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);
    }

    sendChunk(chunk: Chunk){
        let pk = new LevelChunkPacket();
        pk.chunkX = chunk.getX();
        pk.chunkZ = chunk.getZ();
        pk.subChunkCount = chunk.getSubChunkSendCount();
        pk.cacheEnabled = false;
        pk.extraPayload = chunk.toBinary().toString();
        this.dataPacket(pk);

        if (this.spawned === false){
            this.doFirstSpawn();
        }
    }

    setViewDistance(distance: number){
        this.viewDistance = distance;

        let pk = new ChunkRadiusUpdatedPacket();
        pk.radius = this.viewDistance;
        this.dataPacket(pk);

        console.log("Setting view distance for " + this.getName() + " to " + distance);
    }

    getViewDistance(){
        return this.viewDistance;
    }

    static getClientFriendlyGamemode(gamemode){
        gamemode &= 0x03;
        if (gamemode === Player.SPECTATOR) {
            return Player.CREATIVE;
        }

        return gamemode;
    }

    getLowerCaseName(): string{
        return this.iusername;
    }

    /**
     * @return {boolean}
     */
    isAuthenticated(){
        return this.xuid !== "";
    }

    /**
     * If the player is logged into Xbox Live, returns their Xbox user ID (XUID) as a string. Returns an empty string if
     * the player is not logged into Xbox Live.
     */
    getXuid(){
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

    getPlayer(): Player | null {
        return this;
    }

    getFirstPlayed(): number | null {
        //TODO
        return null;
    }

    getLastPlayed(): number | null {
        //TODO
        return null;
    }

    hasPlayedBefore(): boolean {
        return true;
        //TODO
    }



    constructor(server, clientId, ip, port){
        super();
        this.server = server;
        this.randomClientId = clientId;
        this.ip = ip;
        this.port = port;
        this.creationTime = Date.now();

        this.sessionAdapter = new PlayerSessionAdapter(this);

    }

    isOnline(): boolean {
        return this.isConnected() && this.loggedIn;
    }

    isOp(): boolean {
        return true;
        //TODO
    }

    setOp(value: boolean): boolean {
        return true;
        //TODO
    }

    /**
     * @return {boolean}
     */
    isConnected(): boolean{
        return this.sessionAdapter !== null;
    }

    sendMessage(message: string) {
        let pk = new TextPacket();
        pk.type = TextPacket.TYPE_RAW;
        pk.message = message;
        this.dataPacket(pk);
    }

    getServer(): JukeboxServer {
        return this.server;
    }

    dataPacket(packet, needACK = false): boolean{
        return this.sendDataPacket(packet, needACK, false);
    }

    sendDataPacket(packet: DataPacket, needACK = false, immediate = false): boolean{
        if(!this.isConnected()) return false;

        if(!this.loggedIn && !packet.canBeSentBeforeLogin()){
            throw new Error("Attempted to send "+packet.getName()+" to "+this.getName()+" before they got logged in.");
        }

        // let ev = new DataPacketSendEvent(this, packet);
        // this.server.getPluginManager().callEvent(ev);
        // if(ev.isCancelled()){
        //     return false;
        // }

        let identifier = this.getSessionAdapter().sendPacket(packet, needACK, immediate);

        if(needACK && identifier !== null){
            this.needACK[identifier] = false;
            return identifier;
        }

        return true;
    }

    getSessionAdapter(): PlayerSessionAdapter{
        return this.sessionAdapter;
    }

    /**
     * Gets the username
     * @return {string}
     */
    getName(): string {
        return this.username;
    }

    getLoaderId(): number {
        return this.loaderId;
    }

    isLoaderActive(): boolean {
        return this.isConnected();
    }
}