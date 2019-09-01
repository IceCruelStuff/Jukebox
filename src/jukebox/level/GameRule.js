"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameRule {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    getName() {
        return this.name;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        if (typeof value !== typeof this.value) {
            return false;
        }
        this.value = value;
        return true;
    }
}
exports.GameRule = GameRule;
GameRule.COMMAND_BLOCK_OUTPUT = "commandblockoutput";
GameRule.DO_DAYLIGHT_CYCLE = "dodaylightcycle";
GameRule.DO_ENTITY_DROPS = "doentitydrops";
GameRule.DO_FIRE_TICK = "dofiretick";
GameRule.DO_MOB_LOOT = "domobloot";
GameRule.DO_MOB_SPAWNING = "domobspawning";
GameRule.DO_TILE_DROPS = "dotiledrops";
GameRule.DO_WEATHER_CYCLE = "doweathercycle";
GameRule.DROWNING_DAMAGE = "drowningdamage";
GameRule.FALL_DAMAGE = "falldamage";
GameRule.FIRE_DAMAGE = "firedamage";
GameRule.KEEP_INVENTORY = "keepinventory";
GameRule.MOB_GRIEFING = "mobgriefing";
GameRule.NATURAL_REGENERATION = "naturalregeneration";
GameRule.PVP = "pvp";
GameRule.SEND_COMMAND_FEEDBACK = "sedcommandfeedback";
GameRule.SHOW_COORDINATES = "showcoordinates";
GameRule.RANDOM_TICK_SPEED = "randomtickspeed";
GameRule.TNT_EXPLODES = "tntexplodes";
//# sourceMappingURL=GameRule.js.map