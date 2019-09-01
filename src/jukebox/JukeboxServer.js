"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./utils/Config");
const SimpleFileSystem_1 = require("./utils/SimpleFileSystem");
const Jukebox_1 = require("./Jukebox");
const Globals_1 = require("./utils/methods/Globals");
const RakNetAdapter_1 = require("./network/RakNetAdapter");
const ResourcePackManager_1 = require("./resourcepacks/ResourcePackManager");
const BatchPacket_1 = require("./network/mcpe/protocol/BatchPacket");
const PlayerList_1 = require("./utils/PlayerList");
class JukeboxServer {
    constructor(jukebox, localizationManager, logger, paths) {
        this.banByName = null;
        this.banByIP = null;
        this.operators = null;
        this.whitelist = null;
        this.isRunning = true;
        this.hasStopped = false;
        this.pluginManager = null;
        this.profilingTickRate = 20;
        this.updater = null;
        this.tickCounter = 0;
        this.nextTick = 0;
        this.tickAverage = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
        this.useAverage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.currentTPS = 20;
        this.currentUse = 0;
        this.doTitleTick = true;
        this.sendUsageTicker = 0;
        this.dispatchSignals = false;
        this.console = null;
        this.commandMap = null;
        this.onlineMode = true;
        this.networkCompressionAsync = true;
        this.networkCompressionLevel = 7;
        this.autoSaveTicker = 0;
        this.autoSaveTicks = 6000;
        this.forceLanguage = false;
        this.uniquePlayers = [];
        this.queryRegenerateTask = null;
        this.propertyCache = [];
        this.levels = [];
        this.levelDefault = null;
        this.jukebox = jukebox;
        this.localizationManager = localizationManager;
        this.players = new PlayerList_1.PlayerList();
        this.loggedInPlayers = new PlayerList_1.PlayerList();
        this.playerList = new PlayerList_1.PlayerList();
        this.logger = logger;
        this.paths = paths;
        if (!SimpleFileSystem_1.SimpleFileSystem.dirExists(this.getDataPath + "worlds/")) {
            try {
                SimpleFileSystem_1.SimpleFileSystem.mkdir(this.getDataPath() + "worlds/");
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }
        if (!SimpleFileSystem_1.SimpleFileSystem.dirExists(this.getDataPath() + "players/")) {
            try {
                SimpleFileSystem_1.SimpleFileSystem.mkdir(this.getDataPath() + "player/");
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }
        if (!SimpleFileSystem_1.SimpleFileSystem.dirExists(this.paths["plugins"])) {
            try {
                SimpleFileSystem_1.SimpleFileSystem.mkdir(this.paths["plugins"]);
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }
        this.getLogger().info(localizationManager.getPhrase("language"));
        this.getLogger().info(localizationManager.getPhrase("starting-jukebox").replace("{{name}}", this.getName()).replace("{{version}}", this.getVersion()));
        this.getLogger().info(localizationManager.getPhrase("loading-properties"));
        if (!SimpleFileSystem_1.SimpleFileSystem.fileExists(this.getDataPath() + "jukebox.json")) {
            SimpleFileSystem_1.SimpleFileSystem.copy(this.paths["file"] + "jukebox/resources/jukebox.json", this.getDataPath() + "jukebox.json");
        }
        this.config = new Config_1.Config(this.getDataPath() + "jukebox.json", Config_1.Config.JSON, {});
        // this.debuggingLevel = this.config.getNested("debugging.level", 0);
        this.debuggingLevel = 0;
        this.getLogger().setDebugging(this.debuggingLevel);
        this.operators = new Config_1.Config(this.getDataPath() + "ops.json", Config_1.Config.JSON, {});
        this.whitelist = new Config_1.Config(this.getDataPath() + "whitelist.json", Config_1.Config.JSON, {});
        this.maxPlayers = this.config.getNested("server.max-players", 20);
        this.onlineMode = this.config.getNested("server.online-mode", true);
        if (!Globals_1.TRAVIS_BUILD)
            process.stdout.write("\x1b]0;" + this.getName() + " " + this.getJukeboxVersion() + "\x07");
        this.serverID = Math.floor((Math.random() * 99999999) + 1);
        this.getLogger().debug("Server Id: " + this.serverID);
        this.getLogger().info(localizationManager.getPhrase("starting-server").replace("{{ip}}", this.getIP()).replace("{{port}}", this.getPort().toString()));
        this.raknetAdapter = new RakNetAdapter_1.RakNetAdapter(this);
        this.resourcePackManager = new ResourcePackManager_1.ResourcePackManager(this, this.getDataPath() + "resource_packs/");
        this.start();
    }
    batchPackets(players, packets, forceSync = false, immediate = false) {
        let targets = [];
        players.forEach(player => {
            if (player.isConnected())
                targets.push(this.players.getPlayerIdentifier(player));
        });
        if (targets.length > 0) {
            let pk = new BatchPacket_1.BatchPacket();
            packets.forEach(packet => pk.addPacket(packet));
            if (!forceSync && !immediate) {
                //todo compress batched packets async
            }
            else {
                this.broadcastPackets(pk, targets, immediate);
            }
        }
    }
    addOnlinePlayer(player) {
        this.playerList.addPlayer(player.getLowerCaseName(), player);
    }
    //TODO: identifiers should be of type Array<number>
    broadcastPackets(pk, identifiers, immediate) {
        if (!pk.isEncoded) {
            pk.encode();
        }
        if (immediate) {
            identifiers.forEach(id => {
                if (this.players.has(id)) {
                    this.players.getPlayer(id).directDataPacket(pk);
                }
            });
        }
        else {
            identifiers.forEach(id => {
                if (this.players.has(id)) {
                    this.players.getPlayer(id).dataPacket(pk);
                }
            });
        }
    }
    start() {
        this.tickProcessor();
    }
    onPlayerLogin(player) {
        this.loggedInPlayers.addPlayer(player.getLowerCaseName(), player); //todo unique ids
    }
    tick() {
        // let time = Date.now();
        // let tickTime = (Date.now() % 1000) / 1000;
        ++this.tickCounter;
        if ((this.tickCounter % 20) === 0) {
            // this.titleTick();
            this.currentTPS = 20;
            this.currentUse = 0;
        }
        this.raknetAdapter.tick();
    }
    tickProcessor() {
        // @ts-ignore
        let int = createInterval(() => {
            if (this.isRunning) {
                this.tick();
            }
            else {
                //this.forceShutdown();
                int.stop();
            }
        }, 1000 / 20);
        int.run();
    }
    requiresAuthentication() {
        return this.getOnlineMode();
    }
    getOnlineMode() {
        // return this.onlineMode;
        return false;
    }
    getFilePath() {
        return this.paths["file"];
    }
    getIP() {
        return this.config.getNested("server.ip", "0.0.0.0");
    }
    getPort() {
        return this.config.getNested("server.port", 19132);
    }
    getDataPath() {
        return this.paths["data"];
    }
    getLogger() {
        return this.logger;
    }
    getPlayerList() {
        return this.players;
    }
    getRakNetAdapter() {
        return this.raknetAdapter;
    }
    getResourcePackManager() {
        return this.resourcePackManager;
    }
    getName() {
        return Jukebox_1.NAME;
    }
    getVersion() {
        return Jukebox_1.VERSION;
    }
    getJukeboxVersion() {
        return Jukebox_1.JUKEBOX_VERSION;
    }
    getServerId() {
        return this.serverID;
    }
    shutdown() {
        if (!this.isRunning)
            return;
        this.getLogger().info("Shutting down...");
        this.raknetAdapter.shutdown();
        this.pluginManager.disablePlugins();
        this.isRunning = false;
        process.exit;
    }
}
exports.JukeboxServer = JukeboxServer;
JukeboxServer.BROADCAST_CHANNEL_ADMINISTRATIVE = "jukebox.broadcast.admin";
JukeboxServer.BROADCAST_CHANNEL_USERS = "jukebox.broadcast.user";
//TODO: add some typos when classes are ready.
JukeboxServer.instance = null;
JukeboxServer.sleeper = null;
//# sourceMappingURL=JukeboxServer.js.map