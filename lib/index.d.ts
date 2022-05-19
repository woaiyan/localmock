interface Item {
    [key: string]: any;
}
interface MockInterface {
    generator: ((index: number) => Item) | null;
    init: (flag: string, fn: ((index: number) => Item), num: number) => any;
    create: (flag: string, fn: ((index: number) => Item) | null) => any;
    update: (flag: string, id: string, data: Item) => any;
    delete: (flag: string, id: string) => any;
    all: (flag: string) => Item[] | null;
}
export default class Mock implements MockInterface {
    generator: ((index: number) => Item) | null;
    all(flag: string): Item[];
    create(flag: string, createNewData: ((index: number) => Item) | null): Mock | boolean;
    delete(flag: string, uuid: string): Mock | boolean;
    init(flag: string, fn: (nextId: number) => Item, num: number): Mock;
    update(flag: string, uuid: string, newData: Item): Mock | boolean;
}
export {};
