import {Logger} from "./logger/Logger";
import {LocalizationManager} from "./localization/LocalizationManager";
import {Config} from "./utils/Config";
import {SimpleFileSystem} from "./utils/SimpleFileSystem";
import {JUKEBOX_VERSION, NAME, VERSION} from "./Jukebox";
import {TRAVIS_BUILD} from "./utils/methods/Globals";
import {RakNetAdapter} from "./network/RakNetAdapter";
import {ResourcePackManager} from "./resourcepacks/ResourcePackManager";
import {BatchPacket} from "./network/mcpe/protocol/BatchPacket";
import {PlayerList} from "./utils/PlayerList";
import {Player} from "./Player";
// import {Packet} from "../raknet/protocol/Packet";
import {DataPacket} from "./network/mcpe/protocol/DataPacket";

export class JukeboxServer {

    static readonly BROADCAST_CHANNEL_ADMINISTRATIVE = "jukebox.broadcast.admin";
    static readonly BROADCAST_CHANNEL_USERS = "jukebox.broadcast.user";

    //TODO: add some typos when classes are ready.
    private static instance: JukeboxServer = null;

    private static sleeper = null;

    private tickSleeper;

    private banByName = null;

    private banByIP = null;

    private operators: Config = null;

    private whitelist: Config = null;

    private isRunning: boolean = true;

    private hasStopped: boolean = false;

    private pluginManager = null;

    private profilingTickRate: number = 20;

    private updater = null;

    private asyncPool;

    private tickCounter: number = 0;
    private nextTick: number = 0;
    private tickAverage: number[] = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    private useAverage: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private currentTPS: number = 20;
    private currentUse: number = 0;

    private doTitleTick: boolean = true;

    private sendUsageTicker: number = 0;

    private dispatchSignals: boolean = false;

    private readonly logger: Logger;

    private memoryManager;

    private console = null;

    private commandMap = null;

    private craftingManager;

    private maxPlayers: number;

    private onlineMode: boolean = true;

    private autoSave: boolean;

    private rcon;

    private entityMetadata;

    private playerMetadata;

    private levelMetadata;

    private network;
    private networkCompressionAsync: boolean = true;
    private networkCompressionLevel: number = 7;

    private autoSaveTicker: number = 0;
    private autoSaveTicks: number = 6000;

    private baseLang;
    private forceLanguage: boolean = false;

    private readonly serverID: number;

    private dataPath: string;
    private pluginPath: string;

    private uniquePlayers: string[] = [];

    private queryHandler;
    private queryRegenerateTask = null;

    private properties: Config;
    private propertyCache: any[] = [];

    private config: Config;

    private readonly players: PlayerList;
    public loggedInPlayers: PlayerList;
    private playerList: PlayerList;

    private levels = [];

    private levelDefault = null;

    private jukebox: {};

    private localizationManager: LocalizationManager;

    private readonly raknetAdapter: RakNetAdapter;

    readonly debuggingLevel: number;

    private readonly resourcePackManager;

    private readonly paths: {};

    constructor(jukebox, localizationManager: LocalizationManager, logger: Logger, paths: object){
        this.jukebox = jukebox;
        this.localizationManager = localizationManager;
        this.players = new PlayerList();
        this.loggedInPlayers = new PlayerList();
        this.playerList = new PlayerList();

        this.logger = logger;
        this.paths = paths;

        if (!SimpleFileSystem.dirExists(this.getDataPath + "worlds/")){
            try {
                SimpleFileSystem.mkdir(this.getDataPath() + "worlds/");
            }catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }

        if (!SimpleFileSystem.dirExists(this.getDataPath() + "players/")){
            try {
                SimpleFileSystem.mkdir(this.getDataPath() + "player/");
            }catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }

        }

        if (!SimpleFileSystem.dirExists(this.paths["plugins"])){
            try {
                SimpleFileSystem.mkdir(this.paths["plugins"]);
            }catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }

        this.getLogger().info(localizationManager.getPhrase("language"));
        this.getLogger().info(localizationManager.getPhrase("starting-jukebox").replace("{{name}}", this.getName()).replace("{{version}}", this.getVersion()));

        this.getLogger().info(localizationManager.getPhrase("loading-properties"));
        if (!SimpleFileSystem.fileExists(this.getDataPath() + "jukebox.json")) {
            SimpleFileSystem.copy(this.paths["file"] + "jukebox/resources/jukebox.json", this.getDataPath() + "jukebox.json");
        }
        this.config = new Config(this.getDataPath() + "jukebox.json", Config.JSON, {});
        // this.debuggingLevel = this.config.getNested("debugging.level", 0);
        this.debuggingLevel = 0;

        this.getLogger().setDebugging(this.debuggingLevel);

        this.operators = new Config(this.getDataPath() + "ops.json", Config.JSON, {});
        this.whitelist = new Config(this.getDataPath() + "whitelist.json", Config.JSON, {});

        this.maxPlayers = this.config.getNested("server.max-players", 20);
        this.onlineMode = this.config.getNested("server.online-mode", true);

        if(!TRAVIS_BUILD) process.stdout.write("\x1b]0;" + this.getName() + " " + this.getJukeboxVersion() + "\x07");

        this.serverID = Math.floor((Math.random() * 99999999)+1);

        this.getLogger().debug("Server Id: " + this.serverID);

        this.getLogger().info(localizationManager.getPhrase("starting-server").replace("{{ip}}", this.getIP()).replace("{{port}}", this.getPort().toString()));

        this.raknetAdapter = new RakNetAdapter(this);

        this.resourcePackManager = new ResourcePackManager(this, this.getDataPath() + "resource_packs/");
        this.start();
    }

    batchPackets(players, packets, forceSync: boolean = false, immediate: boolean = false): void{
        let targets = [];
        players.forEach(player => {
            if(player.isConnected()) targets.push(this.players.getPlayerIdentifier(player));
        });

        if(targets.length > 0){
            let pk = new BatchPacket();

            packets.forEach(packet => pk.addPacket(packet));

            if(!forceSync && !immediate){
                //todo compress batched packets async
            }else{
                this.broadcastPackets(pk, targets, immediate);
            }
        }
    }

    addOnlinePlayer(player: Player){
        this.playerList.addPlayer(player.getLowerCaseName(), player);
    }

    //TODO: identifiers should be of type Array<number>
    broadcastPackets(pk: BatchPacket, identifiers: any, immediate: boolean): void{
        if(!pk.isEncoded){
            pk.encode();
        }

        if(immediate){
            identifiers.forEach(id => {
                if(this.players.has(id)){
                    this.players.getPlayer(id).directDataPacket(pk);
                }
            });
        }else{
            identifiers.forEach(id => {
                if(this.players.has(id)){
                    this.players.getPlayer(id).dataPacket(pk);
                }
            });
        }
    }

    start(): void{
        this.tickProcessor();
    }

    onPlayerLogin(player): void{
        this.loggedInPlayers.addPlayer(player.getLowerCaseName(), player); //todo unique ids
    }

    getOnlinePlayers(): Player[]{
        return Array.from(this.playerList.values());
    }

    broadcastMessage(message, recipients = this.getOnlinePlayers()){
        recipients.forEach(recipient => recipient.sendMessage(message));

        return recipients.length;
    }

    tick(): void{
        // let time = Date.now();

        // let tickTime = (Date.now() % 1000) / 1000;

        ++this.tickCounter;

        if((this.tickCounter % 20) === 0){
            // this.titleTick();

            this.currentTPS = 20;
            this.currentUse = 0;
        }

        this.raknetAdapter.tick();
    }

    tickProcessor(): void{
        // @ts-ignore
        let int = createInterval(() => {
            if(this.isRunning){
                this.tick();
            }else{
                //this.forceShutdown();
                int.stop();
            }
        }, 1000 / 20);
        int.run();
    }

    requiresAuthentication(): boolean{
        return this.getOnlineMode();
    }

    getOnlineMode(): boolean{
        // return this.onlineMode;
        return false;
    }

    getFilePath(): string{
        return this.paths["file"];
    }

    getIP(): string{
        return this.config.getNested("server.ip", "0.0.0.0");
    }

    getPort(): number{
        return this.config.getNested("server.port", 19132);
    }

    getDataPath(): string{
        return this.paths["data"];
    }

    getLogger(): Logger{
        return this.logger;
    }

    getPlayerList(): PlayerList{
        return this.players;
    }

    getRakNetAdapter(): RakNetAdapter{
        return this.raknetAdapter;
    }

    getResourcePackManager(){
        return this.resourcePackManager;
    }

    getName(): string{
        return NAME;
    }

    getVersion(){
        return VERSION;
    }

    getJukeboxVersion(){
        return JUKEBOX_VERSION;
    }

    getServerId(){
        return this.serverID;
    }

    shutdown(){
        if (!this.isRunning) return;

        this.getLogger().info("Shutting down...");
        this.raknetAdapter.shutdown();
        this.pluginManager.disablePlugins();

        this.isRunning = false;

        process.exit;
    }
}