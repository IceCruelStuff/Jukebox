export interface ResourcePack {

    getPath(): string;

    getPackName(): string;

    getPackId(): string;

    getPackSize(): number;

    getPackVersion(): string;

    getSha256(): string;

    getPackChunk(start: number, lenght: number): string;
    
}