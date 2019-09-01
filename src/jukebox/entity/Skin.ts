export class Skin {

    private readonly skinId: string;
    private readonly skinData: string;
    private readonly capeData: string;
    private readonly geometryName: string;
    private geometryData: string;

    public readonly ACCEPTED_SKIN_SIZES = [
        64 * 32 * 4,
        64 * 64 * 4,
        128 * 128 * 4
    ];

    constructor(skinId: string, skinData: string, capeData: string, geometryName: string, geometryData: string){
        this.skinId = skinId;
        this.skinData = skinData;
        this.capeData = capeData;
        this.geometryName = geometryName;
        this.geometryData = geometryData;
    }

    isValid(): boolean{
        try {
            this.validate();
            return true;
        }catch (e) {
            return false;
        }
    }

    validate(): void{
        if (this.skinId === ""){
            throw new Error("Skin ID must not be empty");
        }
        let len = this.skinData.length;
        if (!this.ACCEPTED_SKIN_SIZES.includes(len)) {
            throw new Error(`Invalid skin data size ${len} bytes(allowed sizes: ${this.ACCEPTED_SKIN_SIZES.join(", ")})`);
        }
        if (this.capeData !== "" && this.capeData.length !== 8192){
            throw new Error(`Invalid cape data size ${this.capeData.length} bytes (must be exactly 8192 bytes)`);
        }
        //TODO: validate geometry
    }

    getSkinId(): string{
        return this.skinId;
    }

    getSkinData(): string{
        return this.skinData;
    }

    getCapeData(): string{
        return this.capeData;
    }

    getGeometryName(): string{
        return this.geometryName;
    }

    getGeometryData(): string{
        return this.geometryData;
    }

    debloatGeometryData(): void{
        if (this.geometryData !== ""){
            this.geometryData = String(JSON.stringify(JSON.parse(this.geometryData)));
        }
    }
}