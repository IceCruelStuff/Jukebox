import {JukeboxServer} from "./JukeboxServer";
import {Logger} from "./logger/Logger";
import {Config} from "./utils/Config";
import {LocalizationManager} from "./localization/LocalizationManager";
import {TRAVIS_BUILD} from "./utils/methods/Globals";
import * as Path from "path";
import * as fs from "fs";

export const NAME = "Jukebox";
export const VERSION = "1.12.0";
export const JUKEBOX_VERSION = "0.1";
// export const START_TIME = Date.now();
// export const CODENAME = "[BETA]";
// export const API_VERSION = "1.0";

export function Jukebox(paths: any) {

    let logger = new Logger("Server");
    let path = {
      file: Path.normalize(__dirname + "/../"),
      data: Path.normalize(__dirname + "/../../"),
      plugins: Path.normalize(__dirname + "/../../plugins/")
    };

    for (let i in paths){
        if (paths.hasOwnProperty(i)){
            if (typeof path[i] !== "undefined"){
                path[i] = paths[i];
            }
        }
    }

    let config = new Config(path.data + "jukebox.json", Config.JSON, {});
    let localizationManager = new LocalizationManager(config.getNested("server.language", "en"));
    localizationManager.loadLanguages();

    logger.info(localizationManager.getPhrase("loading"));

    let server = new JukeboxServer(this, localizationManager, logger, path);

    if (TRAVIS_BUILD === true){
        server.shutdown();
    }
}

new Jukebox(null);