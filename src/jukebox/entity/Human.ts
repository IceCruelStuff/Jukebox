import {Creature} from "./Creature";
import {Skin} from "./Skin";

export class Human extends Creature{

    protected inventory;

    private uuid;
    protected skin: Skin;

    getUniqueId(){
        return this.uuid;
    }

    setSkin(skin: Skin): void{
        skin.validate();
        this.skin = skin;
        this.skin.debloatGeometryData();
    }
}