// Configuration.js
export default class NestedTraversal {
    constructor(data = {}) {
        this.data = data;
    }

    traverse(path) {
        const value = this.#getValueAtPath(path);
        return new this.constructor(value);
    }

    get(path) {
        return this.#getValueAtPath(path);
    }

    set(path, value) {
        this.#setValueAtPath(path, value);
        return this;
    }

    forEach(callback) {
        if (Array.isArray(this.data)) {
            this.data.forEach((item, index) => {
                callback(new this.constructor(item), index);
            });
        } else if (typeof this.data === 'object' && this.data !== null) {
            Object.entries(this.data).forEach(([key, item], index) => {
                callback(new this.constructor(item), key);
            });
        }
    }

    toJSON() {
        return this.data;
    }

    merge(mergeData) {
        this.data = this.#doMerge(this.data, mergeData);
    }

    // Check if path exists
    has(path) {
        return this.#getValueAtPath(path) !== undefined;
    }

    // Get keys of object or indices of array
    keys() {
        if (Array.isArray(this.data)) {
            return this.data.map((_, index) => index);
        } else if (typeof this.data === 'object' && this.data !== null) {
            return Object.keys(this.data);
        }
        return [];
    }

    // Get values of object or array
    values() {
        if (Array.isArray(this.data) || (typeof this.data === 'object' && this.data !== null)) {
            return Object.values(this.data);
        }
        return [];
    }

    // Get entries of object or array
    entries() {
        if (Array.isArray(this.data) || (typeof this.data === 'object' && this.data !== null)) {
            return Object.entries(this.data);
        }
        return [];
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
            if (o === undefined) return o;

            const isArrayIndex = !isNaN(i) && i !== '';
            const nextIsArrayIndex = !isNaN(keys[keys.indexOf(i) + 1]) && keys[keys.indexOf(i) + 1] !== '';

            if (isArrayIndex) {
                const index = parseInt(i, 10);
                if (!Array.isArray(o)) {
                    o = [];
                }
                if (o[index] === undefined) {
                    o[index] = nextIsArrayIndex ? [] : {};
                }
                return o[index];
            } else {
                if (typeof o[i] !== 'object' || o[i] === null) {
                    o[i] = nextIsArrayIndex ? [] : {};
                }
                return o[i];
            }
        }, this.data);

        if (!isNaN(last) && last !== '') {
            const index = parseInt(last, 10);
            if (!Array.isArray(obj)) {
                if (Object.keys(obj).length === 0) {
                    // If it's an empty object, we can safely convert it to an array
                    this.#setValueAtPath(keys.join('.'), []);
                    return this.#setValueAtPath(path, value);
                } else {
                    throw new Error('Cannot set an array index on a non-array object');
                }
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

