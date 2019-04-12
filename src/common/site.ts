import { CrudStamp } from './crudStamp';

export class Site {
    url: string;
    name?: string;

    static _int: number = 0;

    constructor(url: string) {
        this.url = url;

        this.d = {} as CrudStamp;
        this.d.c = new Date().toISOString();
        this.d.u = this.d.c;
        this.d.d = undefined;
        this.d.i = ++Site._int;
    }
    // dateinfo: Date.prototype.toISOString() data
    d: CrudStamp;

    isSameItem(site: Site) {
        return (this.d.i === site.d.i)
            && (this.d.c === site.d.c);
    }

    get key(): string {
        return Site.KeyFromCrud(this.d);
    }

    static KeyFromCrud(stamp: CrudStamp) { return `${stamp.i} ${stamp.c}`; }

    static FromObject(site: object) {
        if (site instanceof Site) { return site; }

        var newSite = Object.assign(new Site(''), site);
        newSite.d = Object.assign(newSite.d, (<any>site).d);

        Site._int -= 1;

        return newSite;
    }

    toObject() {
        return Object.assign({}, this);
    }
}