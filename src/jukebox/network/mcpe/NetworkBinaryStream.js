"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryStream_1 = require("../../../binarystream/BinaryStream");
const Vector3_1 = require("../../math/Vector3");
class NetworkBinaryStream extends BinaryStream_1.BinaryStream {
    getString() {
        return this.get(this.getUnsignedVarInt()).toString();
    }
    putString(v) {
        this.putUnsignedVarInt(Buffer.byteLength(v));
        this.append(Buffer.from(v, "utf8"));
        return this;
    }
    getEntityUniqueId() {
        return this.getVarLong();
    }
    putEntityUniqueId(eid) {
        this.putVarLong(eid);
        return this;
    }
    getEntityRuntimeId() {
        return this.getUnsignedVarLong();
    }
    putEntityRuntimeId(eid) {
        this.putUnsignedVarLong(eid);
        return this;
    }
    getBlockPosition(x, y, z) {
        return [
            this.getVarInt(),
            this.getUnsignedVarInt(),
            this.getVarInt()
        ];
    }
    putBlockPosition(x, y, z) {
        this.putVarInt(x)
            .putUnsignedVarInt(y)
            .putVarInt(z);
        return this;
    }
    getVector3() {
        return new Vector3_1.Vector3(this.getRoundedLFloat(4), this.getRoundedLFloat(4), this.getRoundedLFloat(4));
    }
    putVector3(vector) {
        this.putLFloat(vector.x);
        this.putLFloat(vector.y);
        this.putLFloat(vector.z);
    }
    getGameRules() {
        let count = this.getUnsignedVarInt();
        let rules = [];
        for (let i = 0; i < count; ++i) {
            let name = this.getString();
            let type = this.getUnsignedVarInt();
            let value = null;
            switch (type) {
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
    putGameRules(rules) {
        this.putUnsignedVarInt(rules.length);
        rules.forEach(rule => {
            this.putString(rule.getName());
            if (typeof rule.getValue() === "boolean") {
                this.putByte(1);
                this.putBool(rule.getValue());
            }
            else if (Number.isInteger(rule.getValue())) {
                this.putByte(2);
                this.putUnsignedVarInt(rule.getValue());
            }
            else if (typeof rule.getValue() === "number" && !Number.isInteger(rule.getValue())) {
                this.putByte(3);
                this.putLFloat(rule.getValue());
            }
        });
        return this;
    }
}
exports.NetworkBinaryStream = NetworkBinaryStream;
//# sourceMappingURL=NetworkBinaryStream.js.map