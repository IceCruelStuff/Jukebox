"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Skin {
    constructor(skinId, skinData, capeData, geometryName, geometryData) {
        this.ACCEPTED_SKIN_SIZES = [
            64 * 32 * 4,
            64 * 64 * 4,
            128 * 128 * 4
        ];
        this.skinId = skinId;
        this.skinData = skinData;
        this.capeData = capeData;
        this.geometryName = geometryName;
        this.geometryData = geometryData;
    }
    isValid() {
        try {
            this.validate();
            return true;
        }
        catch (e) {
            return false;
        }
    }
    validate() {
        if (this.skinId === "") {
            throw new Error("Skin ID must not be empty");
        }
        let len = this.skinData.length;
        if (!this.ACCEPTED_SKIN_SIZES.includes(len)) {
            throw new Error(`Invalid skin data size ${len} bytes(allowed sizes: ${this.ACCEPTED_SKIN_SIZES.join(", ")})`);
        }
        if (this.capeData !== "" && this.capeData.length !== 8192) {
            throw new Error(`Invalid cape data size ${this.capeData.length} bytes (must be exactly 8192 bytes)`);
        }
        //TODO: validate geometry
    }
    getSkinId() {
        return this.skinId;
    }
    getSkinData() {
        return this.skinData;
    }
    getCapeData() {
        return this.capeData;
    }
    getGeometryName() {
        return this.geometryName;
    }
    getGeometryData() {
        return this.geometryData;
    }
    debloatGeometryData() {
        if (this.geometryData !== "") {
            this.geometryData = String(JSON.stringify(JSON.parse(this.geometryData)));
        }
    }
}
exports.Skin = Skin;
//# sourceMappingURL=Skin.js.map