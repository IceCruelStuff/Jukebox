import {Skin} from "../../../../entity/Skin";

export interface SkinAdapter {

    toSkinData(skin) : SkinData;

    fromSkinData(data) : Skin;

}
