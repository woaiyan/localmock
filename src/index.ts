
interface Item {
    [key:string] :any
}

interface Data {
    nextId: number;
    data: {
        [key: string]: Item
    };
}



interface MockInterface{
    generator: ((index: number) => Item) | null
    init: (flag: string, fn: ((index: number) => Item) , num: number) => any;
    create: (flag: string,  fn: ((index: number) => Item) | null) => any;
    update: (flag: string, id: string, data: Item) => any;
    delete: (flag: string, id: string) => any;
    all: (flag: string) => Item[] | null
}



function geneUuid() {
    const crypto: any = window.crypto

    if (crypto && crypto.randomUUID){
        return crypto.randomUUID();
    }
    return Date.now();
}

export default class Mock implements MockInterface{
    generator: ((index: number) => Item) | null = null;

    all(flag: string): Item[] {
        if (!this.generator) {
            return [];
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return  [];
        }
        const json: Data = JSON.parse(storage)
        return Object.values(json.data);
    }

    create(flag: string, createNewData: ((index: number) => Item) | null): Mock | boolean {
        if (!this.generator) {
            return false;
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return false;
        }
        const json: Data = JSON.parse(storage);
        const data = json.data;
        const nextId = json.nextId
        const generator = createNewData || this.generator;
        const item = generator(nextId);
        const uuid = geneUuid();
        item.uuid = uuid;
        data[uuid] = item;
        localStorage.setItem(flag, JSON.stringify({nextId: nextId + 1, data: data}));
        return this;
    }

    delete(flag: string, uuid: string): Mock | boolean {
        if (!this.generator) {
            return false;
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return false;
        }
        const json: Data = JSON.parse(storage)
        delete json.data[uuid];
        localStorage.setItem(flag, JSON.stringify(json));
        return this;
    }

    init(flag: string, fn: (nextId: number) => Item, num: number): Mock {
        this.generator = fn;
        if (!localStorage.getItem(flag)) {
            const json: Data = {nextId: 0, data: {}}
            localStorage.setItem(flag, JSON.stringify(json))
            for (let i = 0; i < num; i++) {
                this.create(flag, null);
            }
        };
        return this;
    }

    update(flag: string, uuid: string, newData: Item): Mock | boolean {
        if (!this.generator) {
            return false;
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return false;
        }
        const json: Data = JSON.parse(storage)
        const data = json.data;
        const item = data[uuid]
        if (!item) {
            return false;
        }
        newData.uuid = uuid;
        data[uuid] = newData;
        localStorage.setItem(flag, JSON.stringify(json))
        return this;
    }

}


