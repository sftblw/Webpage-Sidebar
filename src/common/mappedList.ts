/**
 * array with map.
 * Additionally you can sort on add & remove.
 * 
 * - fast retriving with index.
 * - possibile slow insertion & removal: TODO: replace with sorted tree
 *  
 * This **unintentionally & intentionally** does not provide iterator.
 * TODO: consider providing enumerator 🤔
 */
export class MappedList<TKey, TItem> {
    protected _list: Array<TItem> = [];
    protected _map: Map<TKey, TItem> = new Map();

    protected getKeyFn: (item: TItem) => TKey;
    protected sortFn: undefined | ((item1: TItem, item2: TItem) => number) = undefined;

    /**
     * return clone of this list.
     * it means you cannot and should not modify the list without using provided functions.
     */
    get list(): Array<TItem> { return Array.from(this._list); }
    /**
     * Replace list with provided one.
     * This method does shallow copy of provided array, so you can assign new item into your array.
     */
    set list(list: Array<TItem>) {
        this._list = Array.from(list);

        this.__doSort();

        this._map.clear();
        this._list.forEach(item => {
            this._map.set(this.getKeyFn(item), item);
        });
    }
    /**
     * This does not assure read-onlyness. don't edit.
     */
    get readOnlyList(): ReadonlyArray<TItem> { return this._list; }

    constructor(
        getKeyFn: (item: TItem) => TKey,
        sortFn: undefined | ((item1: TItem, item2: TItem) => number) = undefined
    ) {
        this.getKeyFn = getKeyFn;
        this.sortFn = sortFn;
    }

    //// STUB ////

    protected __doSort() {
        if (this.sortFn !== undefined) {
            this._list = this._list.sort(this.sortFn);
        }
    }

    protected __removeDuplicate(item: TItem) {
        var key = this.getKeyFn(item);
        this.__removeByKey(key);
    }

    protected __removeByKey(key: TKey) {
        if (this._map.has(key)) {
            this._map.delete(key);
            this._list = this._list.filter(item => this.getKeyFn(item) !== key);
        }
    }

    //// CRUD ////

    /**
     * Only one with key will be inserted.
     * 
     * - slow when item is already existing (I don't care because this application does not require duplicated insertion)
     * 
     * @param item item to add
     */
    add(item: TItem) {
        this.__removeDuplicate(item);

        this._list.push(item);
        this._map.set(this.getKeyFn(item), item);

        this.__doSort();
    }

    remove(item: TItem) {
        this.__removeDuplicate(item);
        this.__doSort();
    }

    removeByKey(key: TKey) {
        this.__removeByKey(key);
    }

    get(item: TItem) {
        return this._map.get(this.getKeyFn(item));
    }
}

/**
 * limits item when inserted.
 */
export class LimitedMappedList<TKey, TItem> extends MappedList<TKey, TItem> {
    _limitCount: number;

    set list(list: Array<TItem>) {
        this._list = Array.from(list);

        this.__doSort();

        this._map.clear();
        this._list.forEach(item => {
            this._map.set(this.getKeyFn(item), item);
        });

        this.__limit();
    }
    get list(): Array<TItem> { return Array.from(this._list); }

    constructor(
        limitCount: number,
        getKeyFn: (item: TItem) => TKey,
        sortFn: undefined | ((item1: TItem, item2: TItem) => number) = undefined
    ) {
        super(getKeyFn, sortFn);
        this._limitCount = limitCount;
    }

    //// STUB ////

    protected __limit() {
        if (this._list.length >= this._limitCount) { return; }

        let removalTarget = this._list.slice(this._limitCount, this._list.length);

        this._list = this._list.slice(0, this._limitCount);

        removalTarget.forEach(val => {
            this._map.delete(this.getKeyFn(val));
        });
    }

    //// CRUD ////

    add(item: TItem) {
        super.add(item);
        this.__doSort();
        this.__limit();
    }
}