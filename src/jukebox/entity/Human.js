"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Creature_1 = require("./Creature");
class Human extends Creature_1.Creature {
    getUniqueId() {
        return this.uuid;
    }
    setSkin(skin) {
        skin.validate();
        this.skin = skin;
        this.skin.debloatGeometryData();
    }
}
exports.Human = Human;
//# sourceMappingURL=Human.js.map