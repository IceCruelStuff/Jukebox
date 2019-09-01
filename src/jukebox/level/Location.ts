import {Position} from "./Position";

export class Location extends Position{

    public yaw: number;
    public pitch: number;

    constructor(x = 0, y = 0, z = 0, yaw = 0.0, pitch = 0.0, level = null){
        super(x, y, z, level);
        this.yaw = yaw;
        this.pitch = pitch;
    }

    /**
     * @param pos   {Vector3}
     * @param level {Level|null}
     * @param yaw   {Number}
     * @param pitch {Number}
     *
     * @return {Location}
     */
    static fromObject(pos, level = null, yaw = 0.0, pitch = 0.0){
        return new Location(pos.x, pos.y, pos.z, yaw, pitch, (level === null ? (pos instanceof Position ? pos.level : null) : level));
    }

    /**
     * Return a Location instance
     *
     * @return {Location}
     */
    asLocation(){
        return new Location(this.x, this.y, this.z, this.yaw, this.pitch, this.level);
    }

    getYaw(){
        return this.yaw;
    }

    getPitch(){
        return this.pitch;
    }

    toString(){
        // return "Location (level=" + (this.isValid() ? this.getLevel().getName() : "null") + ", x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", yaw=" + this._yaw + ", pitch=" + this._pitch + ")";
    }

    equals(v){
        if(v instanceof Location){
            return super.equals(v) && v.yaw === this.yaw && v.pitch === this.pitch;
        }
        return super.equals(v);
    }
}