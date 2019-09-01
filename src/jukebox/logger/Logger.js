"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TerminalTextFormat_1 = require("../utils/TerminalTextFormat");
const TextFormat_1 = require("../utils/TextFormat");
// import {utc} from "time-stamp";
const TimeStamp = require("time-stamp"); //TODO: This work with right time but throw error.
class Logger {
    constructor(caller, subCaller = "") {
        this.debuggingLevel = 0;
        this.caller = caller;
        this.subCaller = subCaller;
    }
    emergency(message) {
        return this.log("Emergency", arguments, TerminalTextFormat_1.TerminalTextFormat.RED);
    }
    alert(message) {
        return this.log("Alert", arguments, TerminalTextFormat_1.TerminalTextFormat.RED);
    }
    critical(message) {
        return this.log("Critical", arguments, TerminalTextFormat_1.TerminalTextFormat.RED);
    }
    error(message) {
        return this.log("Error", arguments, TerminalTextFormat_1.TerminalTextFormat.DARK_RED);
    }
    warning(message) {
        return this.log("Warning", arguments, TerminalTextFormat_1.TerminalTextFormat.YELLOW);
    }
    notice(message) {
        return this.log("Notice", arguments, TerminalTextFormat_1.TerminalTextFormat.AQUA);
    }
    info(message) {
        return this.log("Info", arguments, TerminalTextFormat_1.TerminalTextFormat.GRAY);
    }
    debug(message, response = "") {
        if (this.debuggingLevel < 1)
            return;
        return this.log("Debug", arguments, TerminalTextFormat_1.TerminalTextFormat.GRAY);
    }
    debugExtensive(message) {
        if (this.debuggingLevel < 2)
            return;
        return this.log("Debug", arguments, TerminalTextFormat_1.TerminalTextFormat.GRAY);
    }
    /* NOTE: error must be a Error instance */
    logError(error) {
        error = error.stack.split("\n");
        this.error(error.shift());
        error.forEach(trace => this.debug(trace));
    }
    log(level, messages, color = TerminalTextFormat_1.TerminalTextFormat.GRAY) {
        if (messages.length === 0)
            return;
        messages = Array.from(messages).map(message => (typeof message === "string" ? TextFormat_1.TextFormat.toTerminal(message) : message) + TerminalTextFormat_1.TerminalTextFormat.RESET);
        // @ts-ignore
        log(TerminalTextFormat_1.TerminalTextFormat.BLUE + "[" + TimeStamp("HH:mm:ss") + "]" + TerminalTextFormat_1.TerminalTextFormat.RESET + " " + color + "[" + this.caller + " > " + level + "]:" + this.subCaller, messages);
        function log(prefix, args) {
            console.log(prefix, ...args);
        }
    }
    setDebugging(level) {
        this.debuggingLevel = level;
        return this;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map