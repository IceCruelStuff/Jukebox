import {CommandMap} from "./CommandMap";
import {CommandSender} from "./CommandSender";

export abstract class Command {

    private readonly name: string;

    private nextLabel: string;

    private label: string;

    private aliases: string[] = [];

    private activeAliases: string[] = [];

    private commandMap: CommandMap = null;

    protected description: string = "";

    protected usageMessage: string;

    private permission: string|null = null;

    private permissionMessage: string = null;

    //TODO
    public timings;

    constructor(name: string, description: string = "", usageMessage: string = null, aliases: [] = []){
        this.name = name;
        this.setLabel(name);
    }

    /**
     * @param sender {CommandSender}
     * @param commandLabel {string}
     * @param args {[]}
     */
    abstract execute(sender: CommandSender, commandLabel: string, args: []);

    /**
     * @return {string}
     */
    getName(): string{
        return this.getName();
    }

    /**
     * @return {string|null}
     */
    getPermission(): string|null{
        return this.permission;
    }

    /**
     * @param permission {string|null}
     */
    setPermission(permission: string = null){
        this.permission = permission;
    }

    /**
     * @param target {CommandSender}
     *
     * @return {boolean}
     */
    testPermission(target: CommandSender): boolean{
        if (this.testPermissionSilent(target)){
            return true;
        }

        if (this.permissionMessage === null){
            //TODO: translated phrase
            // target.sendMessage(target.getServer().get)
        }else if (this.permissionMessage !== ""){
            //TODO target.sendMessage()
        }

        return false;
    }

    /**
     * @param target {CommandSender}
     *
     * @return {boolean}
     */
    testPermissionSilent(target: CommandSender): boolean{
        if (this.permission === null || this.permission === ""){
            return true;
        }

        this.permission.split(";").forEach(permission => {
           if (target.hasPermission(permission)){
               return true;
           }
        });

        return false;
    }

    /**
     * @return {string}
     */
    getLabel(): string{
        return this.label;
    }

    setLabel(name: string): boolean{
        this.nextLabel = name;
        if (!this.isRegistered()) {
            //TODO: timings

            this.label = name;

            return true;
        }

        return false;
    }

    /**
     * Registers the command into a Command map
     *
     * @param commandMap {CommandMap}
     *
     * @return {boolean}
     */
    register(commandMap: CommandMap): boolean{
        if (this.allowChangesFrom(commandMap)){
            this.commandMap = commandMap;

            return true
        }

        return false;
    }

    /**
     * @param commandMap {CommandMap}
     *
     * @return {boolean}
     */
    unregister(commandMap: CommandMap): boolean{
        if (this.allowChangesFrom(commandMap)){
            this.commandMap = null;
            this.activeAliases = this.aliases;
            this.label = this.nextLabel;

            return true;
        }

        return false;
    }

    /**
     * @param commandMap {CommandMap}
     *
     * @return {boolean}
     */
    allowChangesFrom(commandMap: CommandMap): boolean{
        return this.commandMap === null || this.commandMap === commandMap;
    }

    /**
     * @return {boolean}
     */
    isRegistered(): boolean{
        return this.commandMap !== null;
    }

    /**
     * @return {string[]}
     */
    getAliases(): string[]{
        return this.activeAliases;
    }

    /**
     * @return {string|null}
     */
    getPermissionMessage(): string|null{
        return this.permissionMessage;
    }

    /**
     * @return {string}
     */
    getDescription(): string{
        return this.description;
    }

    /**
     * @return {string}
     */
    getUsage(): string{
        return this.usageMessage;
    }

    /**
     * @param aliases {string[]}
     */
    setAliases(aliases: string[]){
        this.aliases = aliases;
        if (!this.isRegistered()){
            this.activeAliases = aliases;
        }
    }

    /**
     * @param description {string}
     */
    setDescription(description: string){
        this.description = description;
    }

    /**
     * @param permissionMessage {string}
     */
    setPermissionMessage(permissionMessage: string){
        this.permissionMessage = permissionMessage;
    }

    /**
     * @param usage {string}
     */
    setUsage(usage: string){
        this.usageMessage = usage;
    }

    broadcastCommandMessage(source: CommandSender, message, sendToSource: boolean = true){
        //TODO
    }

    /**
     * @return {string}
     */
    __toString(): string{
        return this.name;
    }

}