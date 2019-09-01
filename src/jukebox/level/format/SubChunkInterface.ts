export interface SubChunkInterface {

    isEmpty(checkLight: boolean): boolean;

    getBlockId(x: number, y: number, z: number): number;

    setBlockId(x: number, y: number, z: number, id: number): boolean;

    getBlockData(x: number, y, z): number ;

    setBlockData(x: number, y, z,  data): boolean;

    getFullBlock(x: number, y, z): number;

    setBlock(x: number, y, z, id , data): boolean;

    getBlockLight(x: number, y, z): number;

    setBlockLight(x: number, y, z,  level): boolean;

    getBlockSkyLight(x: number, y, z): number;

    setBlockSkyLight(x: number, y, z,  level): boolean;

    getHighestBlockAt(x: number, z): number;

    getBlockIdColumn(x: number, z): string;

    getBlockDataColumn(x: number, z): string;

    getBlockLightColumn(x: number, z): string;

    getBlockSkyLightColumn(x: number, z): string;

    getBlockIdArray(): string;

    getBlockDataArray(): string;

    getBlockSkyLightArray(): string;

    setBlockSkyLightArray(data: string);

    getBlockLightArray(): string;

    setBlockLightArray(data: string);

    networkSerialize(): string;
}