import {BinaryStream} from "../../../binarystream/BinaryStream";
import {Vector3} from "../../math/Vector3";
import {GameRule} from "../../level/GameRule";

export class NetworkBinaryStream extends BinaryStream{

    getString(): string{
        return this.get(this.getUnsignedVarInt()).toString();
    }

    putString(v: string): NetworkBinaryStream {
        this.putUnsignedVarInt(Buffer.byteLength(v));
        this.append(Buffer.from(v, "utf8"));
        return this;
    }

    getEntityUniqueId(){
        return this.getVarLong();
    }

    putEntityUniqueId(eid){
        this.putVarLong(eid);
        return this;
    }

    getEntityRuntimeId(){
        return this.getUnsignedVarLong();
    }

    putEntityRuntimeId(eid){
        this.putUnsignedVarLong(eid);
        return this;
    }

    getBlockPosition(x, y, z){
        return [
            this.getVarInt(),
            this.getUnsignedVarInt(),
            this.getVarInt()
        ];
    }

    putBlockPosition(x, y, z){
        this.putVarInt(x)
            .putUnsignedVarInt(y)
            .putVarInt(z);
        return this;
    }

    getVector3(): Vector3{
        return new Vector3(
            this.getRoundedLFloat(4),
            this.getRoundedLFloat(4),
            this.getRoundedLFloat(4)
        )
    }

    putVector3(vector: Vector3){
        this.putLFloat(vector.x);
        this.putLFloat(vector.y);
        this.putLFloat(vector.z);
    }

    getGameRules(){
        let count = this.getUnsignedVarInt();
        let rules = [];
        for(let i = 0; i < count; ++i){
            let name = this.getString();
            let type = this.getUnsignedVarInt();
            let value = null;
            switch(type){
                case 1:
                    value = this.getBool();
                    break;
                case 2:
                    value = this.getUnsignedVarInt();
                    break;
                case 3:
                    value = this.getLFloat();
                    break;
            }

            rules[name] = [type, value];
        }

        return rules;
    }

    putGameRules(rules: GameRule[]): NetworkBinaryStream{
        this.putUnsignedVarInt(rules.length);
        rules.forEach(rule => {
            this.putString(rule.getName());
            if(typeof rule.getValue() === "boolean") {
                this.putByte(1);
                this.putBool(rule.getValue());
            }else if(Number.isInteger(rule.getValue())){
                this.putByte(2);
                this.putUnsignedVarInt(rule.getValue());
            }else if(typeof rule.getValue() === "number" && !Number.isInteger(rule.getValue())){
                this.putByte(3);
                this.putLFloat(rule.getValue());
            }
        });

        return this;
    }

}