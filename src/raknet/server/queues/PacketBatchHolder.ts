export class PacketBatchHolder extends Map {

    add(v): void{
        this.set(v, true);
    }

    remove(v): void{
        this.delete(v);
    }

    getAll(): any{
        return Array.from(this.keys());
    }

    isEmpty(): boolean{
        return this.size === 0;
    }

    getAllAndClear() {
        let packets = this.getAll();
        this.clear();
        return packets;
    }
}