"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JukeboxServer_1 = require("./JukeboxServer");
const Logger_1 = require("./logger/Logger");
const Config_1 = require("./utils/Config");
const LocalizationManager_1 = require("./localization/LocalizationManager");
const Globals_1 = require("./utils/methods/Globals");
const Path = require("path");
exports.NAME = "Jukebox";
exports.VERSION = "1.12.0";
exports.JUKEBOX_VERSION = "0.1";
// export const START_TIME = Date.now();
// export const CODENAME = "[BETA]";
// export const API_VERSION = "1.0";
function Jukebox(paths) {
    let logger = new Logger_1.Logger("Server");
    let path = {
        file: Path.normalize(__dirname + "/../"),
        data: Path.normalize(__dirname + "/../../"),
        plugins: Path.normalize(__dirname + "/../../plugins/")
    };
    for (let i in paths) {
        if (paths.hasOwnProperty(i)) {
            if (typeof path[i] !== "undefined") {
                path[i] = paths[i];
            }
        }
    }
    let config = new Config_1.Config(path.data + "jukebox.json", Config_1.Config.JSON, {});
    let localizationManager = new LocalizationManager_1.LocalizationManager(config.getNested("server.language", "en"));
    localizationManager.loadLanguages();
    logger.info(localizationManager.getPhrase("loading"));
    let server = new JukeboxServer_1.JukeboxServer(this, localizationManager, logger, path);
    if (Globals_1.TRAVIS_BUILD === true) {
        server.shutdown();
    }
}
exports.Jukebox = Jukebox;
new Jukebox(null);
//# sourceMappingURL=Jukebox.js.map