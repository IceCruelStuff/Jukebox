import {Item} from "../item/Item";

export interface Inventory {

    readonly MAX_STACK: 64;

    getSize(): number;

    getMaxStackSize(): number;

    setMaxStackSize(size: number): number;

    getName(): string;

    getTitle(): string;

    getItem(index: number): Item;

    setItem(index: number, item: Item, send: boolean): boolean;

    addItem(...slots: Item[]): [];

    canAddItem(item: Item): boolean;

    removeItem(...slots: Item[]): [];

    getContents(item: [], send: boolean): void;

    //TODO: finish
}