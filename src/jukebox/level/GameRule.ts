export class GameRule {

    static readonly COMMAND_BLOCK_OUTPUT =  "commandblockoutput";
    static readonly DO_DAYLIGHT_CYCLE =  "dodaylightcycle";
    static readonly DO_ENTITY_DROPS =  "doentitydrops";
    static readonly DO_FIRE_TICK =  "dofiretick";
    static readonly DO_MOB_LOOT =  "domobloot";
    static readonly DO_MOB_SPAWNING =  "domobspawning";
    static readonly DO_TILE_DROPS =  "dotiledrops";
    static readonly DO_WEATHER_CYCLE =  "doweathercycle";
    static readonly DROWNING_DAMAGE =  "drowningdamage";
    static readonly FALL_DAMAGE =  "falldamage";
    static readonly FIRE_DAMAGE =  "firedamage";
    static readonly KEEP_INVENTORY =  "keepinventory";
    static readonly MOB_GRIEFING =  "mobgriefing";
    static readonly NATURAL_REGENERATION =  "naturalregeneration";
    static readonly PVP =  "pvp";
    static readonly SEND_COMMAND_FEEDBACK =  "sedcommandfeedback";
    static readonly SHOW_COORDINATES =  "showcoordinates";
    static readonly RANDOM_TICK_SPEED =  "randomtickspeed";
    static readonly TNT_EXPLODES =  "tntexplodes";

    public name: string;
    public value: any;

    constructor(name, value){
        this.name = name;
        this.value = value;
    }

    getName(){
        return this.name;
    }

    getValue(){
        return this.value;
    }

    setValue(value){
        if(typeof value !== typeof this.value){
            return false;
        }
        this.value = value;
        return true;
    }
}