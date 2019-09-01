import {SubChunkInterface} from "./SubChunkInterface";

export class SubChunk implements SubChunkInterface{
    
    private blockIds = [];
    private blockData = [];
    private blockLight = [];
    private skyLight = [];

    constructor(blockIds = [], blockData = [], blockLight = [], skyLight = []){

        if(blockIds.length === 0 || blockIds.length !== 4096){
            this.blockIds = new Array(4096).fill(0x00);
        }

        if(blockData.length === 0 || blockData.length !== 2048){
            this.blockData = new Array(2048).fill(0x00);
        }

        if(blockLight.length === 0 || blockLight.length !== 2048){
            this.blockLight = new Array(2048).fill(0x00);
        }

        if(skyLight.length === 0 || skyLight.length !== 2048){
            this.skyLight = new Array(2048).fill(0xff);
        }
    }

    isEmpty(checkLight = true){
        return (
            this.blockIds.filter(id => id === 0x00).length === 4096 &&
            (!checkLight || (
                this.blockLight.filter(id => id === 0x00).length === 2048 &&
                this.skyLight.filter(id => id === 0xff).length === 2048
            ))
        );
    }

    getBlockId(x, y, z){
        return this.blockIds[SubChunk.getIdIndex(x, y, z)];
    }

    //TODO: to fix.. will never work atm.
    setBlock(x, y, z, id = null, data = null){
        let i = (x << 8) | (z << 4) | y;
        let changed = false;
        if (id !== null){
            let block = String.fromCharCode(id);
            if (this.blockIds !== block){
                this.blockIds = block;
                changed = true;
            }
        }
    }

    setBlockId(x, y, z, id){
        this.blockIds[SubChunk.getIdIndex(x, y, z)] = id;
        return true;
    }

    getBlockData(x, y, z){
        let m = this.blockData[SubChunk.getDataIndex(x, y, z)];
        if((y & 1) === 0){
            return m & 0x0f;
        }else{
            return m >> 4;
        }
    }

    setBlockData(x, y, z, data){
        let i = SubChunk.getDataIndex(x, y, z);
        if((y & 1) === 0){
            this.blockData[i] = (this.blockData[i] & 0xf0) | (data & 0x0f);
        }else{
            this.blockData[i] = (((data & 0x0f) << 4) | this.blockData[i] & 0x0f);
        }
        return true;
    }

    getBlockLight(x, y, z){
        let byte = this.blockLight[SubChunk.getLightIndex(x, y, z)];
        if((y & 1) === 0){
            return byte & 0x0f;
        }else{
            return byte >> 4;
        }
    }

    setBlockLight(x, y, z, level){
        let i = SubChunk.getLightIndex(x, y, z);
        let byte = this.blockLight[i];
        if((y & 1) === 0){
            this.blockLight[i] = (byte & 0xf0) | (level & 0x0f);
        }else{
            this.blockLight[i] = ((level & 0x0f) << 4) | (byte & 0x0f);
        }
        return true;
    }

    getBlockSkyLight(x, y, z){
        let byte = this.skyLight[SubChunk.getLightIndex(x, y, z)];
        if((y & 1) === 0){
            return byte & 0x0f;
        }else{
            return byte >> 4;
        }
    }

    setBlockSkyLight(x, y, z, level){
        let i = SubChunk.getLightIndex(x, y, z);
        let byte = this.skyLight[i];
        if((y & 0x01) === 0){
            this.skyLight[i] = (byte & 0xf0) | (level & 0x0f);
        }else{
            this.skyLight[i] = ((level & 0x0f) << 4) | (byte & 0x0f);
        }
        return true;
    }

    getHighestBlockId(x, z){
        for(let y = 15; y >= 0; y--){
            let id = this.getBlockId(x, y, z);
            if(id !== 0){
                return id;
            }
        }
        return 0;
    }

    getHighestBlockData(x, z){
        return this.getBlockData(x, 15, z);
    }

    getHighestBlock(x, z){
        for(let y = 15; y >= 0; y--){
            if(this.getBlockId(x, y, z) !== 0){
                return y;
            }
        }

        return 0;
    }

    toBinary(){
        return Buffer.from([0x00, ...this.blockIds, ...this.blockData]);
    }

    static getIdIndex(x, y, z){
        return (x << 8) | (z << 4) | y;
    }

    static getDataIndex(x, y, z){
        return (x << 7) + (z << 3) + (y >> 1);
    }

    static getLightIndex(x, y, z){
        return SubChunk.getDataIndex(x, y, z);
    }
}