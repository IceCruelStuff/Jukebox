import {Datagram} from "../../protocol/Datagram";

export class RecoveryQueue extends Map{

    addRecoveryFor(datagram: Datagram): void{
        this.set(datagram.sequenceNumber, datagram);
    }

    isRecoverable(seqNumber: number): boolean{
        return this.has(seqNumber);
    }

    recover(sequenceNumbers: number[]): Datagram[]{
        let datagrams = [];

        sequenceNumbers.forEach(seqNumber => {
            if(this.isRecoverable(seqNumber)){
                datagrams.push(this.get(seqNumber));
            }
        });

        return datagrams;
    }

    remove(seqNumber: number): void{
        this.delete(seqNumber);
    }

    isEmpty(): boolean{
        return this.size === 0;
    }
}