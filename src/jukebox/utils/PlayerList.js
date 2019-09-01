"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerList extends Map {
    addPlayer(id, player) {
        this.set(id, player);
    }
    getPlayer(id) {
        return this.has(id) ? this.get(id) : null;
    }
    hasPlayer(player) {
        return Array.from(this.values()).indexOf(player) !== -1;
    }
    getPlayerIdentifier(player) {
        return Array.from(this.keys())[Array.from(this.values()).indexOf(player)];
    }
    removePlayer(id) {
        return this.delete(id);
    }
}
exports.PlayerList = PlayerList;
//# sourceMappingURL=PlayerList.js.map