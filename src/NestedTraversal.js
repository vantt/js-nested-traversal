// Configuration.js
export default class NestedTraversal {
    constructor(data = {}) {
        this.data = data;
    }

    get(path) {
        const value = this.#getValueAtPath(path);
        if (typeof value === 'object' && value !== null) {
            return new NestedTraversal(value);
        }
        return value;
    }

    set(path, value) {
        this.#setValueAtPath(path, value);
        return this;
    }

    forEach(callback) {        
        if (Array.isArray(this.data)) {
            this.data.forEach((item, index) => {
                callback(new NestedTraversal(item), index);
            });
        } else if (typeof this.data === 'object' && this.data !== null) {
            Object.entries(this.data).forEach(([key, item], index) => {
                callback(new NestedTraversal(item), key);
            });
        }
    }

    toJSON() {
        return this.data;
    }

    merge(mergeData) {
        this.data = this.#doMerge(this.data, mergeData);
    }

    #getValueAtPath(path) {
        return path.split('.').reduce((o, i) => {
            if (o === null || o === undefined) return o;
            return !isNaN(i) && i !== '' ? o[parseInt(i, 10)] : o[i];
        }, this.data);
    }

    #setValueAtPath(path, value) {
        const keys = path.split('.');
        const last = keys.pop();
        const obj = keys.reduce((o, i) => {
            if (typeof o[i] === 'function') return o[i];
            if (!isNaN(i) && i !== '') {
                const index = parseInt(i, 10);
                return Array.isArray(o) ? (o[index] = o[index] || {}) : (o = [])[index] = {};
            }
            return o[i] = o[i] || {};
        }, this.data);
        
        if (!isNaN(last) && last !== '') {
            const index = parseInt(last, 10);
            if (!Array.isArray(obj)) {
                this.#setValueAtPath(keys.join('.'), []);
                return this.#setValueAtPath(path, value);
            }
            obj[index] = value;
        } else {
            obj[last] = value;
        }
    }

    #doMerge(data1, data2) {
        const mergedData = { ...data1 };

        for (const key in data2) {
            if (typeof data2[key] === 'function') {
                mergedData[key] = data2[key];
            } else if (typeof data2[key] === 'object' && data2[key] !== null && !Array.isArray(data2[key])) {
                mergedData[key] = this.#doMerge(mergedData[key] || {}, data2[key]);
            } else {
                mergedData[key] = data2[key];
            }
        }
        
        return mergedData;
    }
}

