import {TerminalTextFormat} from "../utils/TerminalTextFormat";
import {TextFormat} from "../utils/TextFormat";
// import {utc} from "time-stamp";
import * as TimeStamp from "time-stamp"; //TODO: This work with right time but throw error.

export class Logger{

    public debuggingLevel: number = 0;
    public caller: string;
    public subCaller: string;

    constructor(caller: string, subCaller: string = ""){
        this.caller = caller;
        this.subCaller = subCaller;
    }

    emergency(message: string){
        return this.log("Emergency", arguments, TerminalTextFormat.RED);
    }

    alert(message: string){
        return this.log("Alert", arguments, TerminalTextFormat.RED);
    }

    critical(message: string){
        return this.log("Critical", arguments, TerminalTextFormat.RED);
    }

    error(message: string){
        return this.log("Error", arguments, TerminalTextFormat.DARK_RED);
    }

    warning(message: string){
        return this.log("Warning", arguments, TerminalTextFormat.YELLOW);
    }

    notice(message: string){
        return this.log("Notice", arguments, TerminalTextFormat.AQUA);
    }

    info(message: string){
        return this.log("Info", arguments, TerminalTextFormat.GRAY);
    }

    debug(message: string, response:string = ""){
        if (this.debuggingLevel < 1) return;
        return this.log("Debug", arguments, TerminalTextFormat.GRAY);
    }

    debugExtensive(message: string){
        if (this.debuggingLevel < 2) return;
        return this.log("Debug", arguments, TerminalTextFormat.GRAY);
    }

    /* NOTE: error must be a Error instance */
    logError(error: any){
        error = error.stack.split("\n");
        this.error(error.shift());
        error.forEach(trace => this.debug(trace));
    }

    log(level: string, messages: any, color: string = TerminalTextFormat.GRAY){
        if (messages.length === 0) return;

        messages = Array.from(messages).map(message => (typeof message === "string" ? TextFormat.toTerminal(message) : message) + TerminalTextFormat.RESET);

        // @ts-ignore
        log(TerminalTextFormat.BLUE + "[" + TimeStamp("HH:mm:ss") + "]" + TerminalTextFormat.RESET + " " + color + "[" + this.caller + " > " + level + "]:" + this.subCaller, messages);

        function log(prefix: string, args: Array<string>) {
            console.log(prefix, ...args);
        }
    }

    setDebugging(level: number){
        this.debuggingLevel = level;
        return this;
    }
}