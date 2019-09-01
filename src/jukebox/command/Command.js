"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, description = "", usageMessage = null, aliases = []) {
        this.aliases = [];
        this.activeAliases = [];
        this.commandMap = null;
        this.description = "";
        this.permission = null;
        this.permissionMessage = null;
        this.name = name;
        this.setLabel(name);
    }
    /**
     * @return {string}
     */
    getName() {
        return this.getName();
    }
    /**
     * @return {string|null}
     */
    getPermission() {
        return this.permission;
    }
    /**
     * @param permission {string|null}
     */
    setPermission(permission = null) {
        this.permission = permission;
    }
    /**
     * @param target {CommandSender}
     *
     * @return {boolean}
     */
    testPermission(target) {
        if (this.testPermissionSilent(target)) {
            return true;
        }
        if (this.permissionMessage === null) {
            //TODO: translated phrase
            // target.sendMessage(target.getServer().get)
        }
        else if (this.permissionMessage !== "") {
            //TODO target.sendMessage()
        }
        return false;
    }
    /**
     * @param target {CommandSender}
     *
     * @return {boolean}
     */
    testPermissionSilent(target) {
        if (this.permission === null || this.permission === "") {
            return true;
        }
        this.permission.split(";").forEach(permission => {
            if (target.hasPermission(permission)) {
                return true;
            }
        });
        return false;
    }
    /**
     * @return {string}
     */
    getLabel() {
        return this.label;
    }
    setLabel(name) {
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
    register(commandMap) {
        if (this.allowChangesFrom(commandMap)) {
            this.commandMap = commandMap;
            return true;
        }
        return false;
    }
    /**
     * @param commandMap {CommandMap}
     *
     * @return {boolean}
     */
    unregister(commandMap) {
        if (this.allowChangesFrom(commandMap)) {
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
    allowChangesFrom(commandMap) {
        return this.commandMap === null || this.commandMap === commandMap;
    }
    /**
     * @return {boolean}
     */
    isRegistered() {
        return this.commandMap !== null;
    }
    /**
     * @return {string[]}
     */
    getAliases() {
        return this.activeAliases;
    }
    /**
     * @return {string|null}
     */
    getPermissionMessage() {
        return this.permissionMessage;
    }
    /**
     * @return {string}
     */
    getDescription() {
        return this.description;
    }
    /**
     * @return {string}
     */
    getUsage() {
        return this.usageMessage;
    }
    /**
     * @param aliases {string[]}
     */
    setAliases(aliases) {
        this.aliases = aliases;
        if (!this.isRegistered()) {
            this.activeAliases = aliases;
        }
    }
    /**
     * @param description {string}
     */
    setDescription(description) {
        this.description = description;
    }
    /**
     * @param permissionMessage {string}
     */
    setPermissionMessage(permissionMessage) {
        this.permissionMessage = permissionMessage;
    }
    /**
     * @param usage {string}
     */
    setUsage(usage) {
        this.usageMessage = usage;
    }
    broadcastCommandMessage(source, message, sendToSource = true) {
        //TODO
    }
    /**
     * @return {string}
     */
    __toString() {
        return this.name;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map