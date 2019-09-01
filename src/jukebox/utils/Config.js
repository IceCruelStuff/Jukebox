"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem = require("fs");
const Path = require("path");
class Config {
    constructor(file, type, def) {
        this.config = {};
        this.correct = false;
        this.type = Config.DETECT;
        this.load(file, type, def);
    }
    load(file, type = Config.DETECT, def = {}) {
        this.correct = true;
        this.file = file;
        this.type = type;
        if (!(def instanceof Object)) {
            def = {};
        }
        if (!FileSystem.existsSync(file)) {
            this.config = def;
            this.save();
        }
        else {
            if (this.type === Config.DETECT) {
                if (Path.extname(this.file) === ".json") {
                    this.type = Config.JSON;
                }
            }
            if (this.correct === true) {
                let content = FileSystem.readFileSync(this.file, { encoding: "utf-8" });
                if (this.type === Config.JSON) {
                    this.config = eval("(" + content + ")");
                }
                else {
                    this.correct = false;
                    return false;
                }
                if (!(this.config instanceof Object)) {
                    this.config = def;
                }
                this.config = this.fillDefaults(def, this.config);
                this.save();
            }
            else {
                return false;
            }
        }
    }
    reload() {
        this.config = {};
        this.correct = false;
        delete this.type;
        this.load(this.file);
    }
    save() {
        if (this.correct === true) {
            let content;
            if (this.type === Config.JSON) {
                content = JSON.stringify(this.correct, null, 4);
            }
            FileSystem.writeFileSync(this.file, content);
            return true;
        }
        else {
            return false;
        }
    }
    getNested(k, def) {
        let parts = k.split(".");
        if (!this.config[parts[0]]) {
            return def;
        }
        let config = this.config[parts.shift()];
        while (parts.length > 0) {
            let part = parts.shift();
            if (typeof config[part] !== "undefined") {
                config = config[part];
            }
            else {
                return def;
            }
        }
        return config;
    }
    get(k, def = false) {
        return ((this.correct && typeof this.config[k] !== "undefined") ? this.config[k] : def);
    }
    setAll(v) {
        this.config = v;
    }
    exists(k, lower) {
        if (lower === true) {
            k = k.toLowerCase();
            let array = Object.keys(this.config).map(k => { return k.toLowerCase(); });
            return typeof array[k] !== "undefined";
        }
        else {
            return typeof this.config[k] !== "undefined";
        }
    }
    remove(k) {
        delete this.config[k];
    }
    fillDefaults(def, data) {
        return Object.assign({}, def, data);
    }
    setDefaults(def) {
        this.config = this.fillDefaults(def, this.config);
    }
}
exports.Config = Config;
Config.DETECT = 0;
Config.JSON = 1;
//# sourceMappingURL=Config.js.map