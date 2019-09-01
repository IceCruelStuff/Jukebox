export class SplitQueue extends Map {

    add(pk): void{
        if(this.has(pk.splitID)){
            let m = this.get(pk.splitID);
            m.set(pk.splitIndex, pk);
            this.set(pk.splitID, m);
        }else{
            let m = new Map([[pk.splitIndex, pk]]);
            this.set(pk.splitID, m);
        }
    }

    getSplitSize(splitID: number){
        return this.get(splitID).size;
    }

    getSplits(splitID: number){
        return this.get(splitID);
    }

    remove(splitID): void{
        this.delete(splitID);
    }

    isEmpty(): boolean{
        return this.size === 0;
    }
}