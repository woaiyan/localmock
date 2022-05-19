function geneUuid() {
    const crypto = window.crypto;
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now();
}
export default class Mock {
    constructor() {
        this.generator = null;
    }
    all(flag) {
        if (!this.generator) {
            return [];
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return [];
        }
        const json = JSON.parse(storage);
        return Object.values(json.data);
    }
    create(flag, createNewData) {
        if (!this.generator) {
            return false;
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return false;
        }
        const json = JSON.parse(storage);
        const data = json.data;
        const nextId = json.nextId;
        const generator = createNewData || this.generator;
        const item = generator(nextId);
        const uuid = geneUuid();
        item.uuid = uuid;
        data[uuid] = item;
        localStorage.setItem(flag, JSON.stringify({ nextId: nextId + 1, data: data }));
        return this;
    }
    delete(flag, uuid) {
        if (!this.generator) {
            return false;
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return false;
        }
        const json = JSON.parse(storage);
        delete json.data[uuid];
        localStorage.setItem(flag, JSON.stringify(json));
        return this;
    }
    init(flag, fn, num) {
        this.generator = fn;
        if (!localStorage.getItem(flag)) {
            const json = { nextId: 0, data: {} };
            localStorage.setItem(flag, JSON.stringify(json));
            for (let i = 0; i < num; i++) {
                this.create(flag, null);
            }
        }
        ;
        return this;
    }
    update(flag, uuid, newData) {
        if (!this.generator) {
            return false;
        }
        const storage = localStorage.getItem(flag);
        if (!storage) {
            return false;
        }
        const json = JSON.parse(storage);
        const data = json.data;
        const item = data[uuid];
        if (!item) {
            return false;
        }
        newData.uuid = uuid;
        data[uuid] = newData;
        localStorage.setItem(flag, JSON.stringify(json));
        return this;
    }
}
