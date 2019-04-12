import { MappedList, LimitedMappedList } from './mappedList';
import { CrudStamp } from './crudStamp';
import { Site } from './site';

export class SiteState {
    private _siteList: MappedList<string, Site> = new MappedList((site: Site) => site.key);

    get siteListReadonly(): ReadonlyArray<Site> {
        return this._siteList.readOnlyList;
    }
    set siteList(val: Array<Site>) {
        this._siteList.list = val;
    }

    private _deletedSiteList: LimitedMappedList<string, CrudStamp> = new LimitedMappedList(
        64,
        (stamp: CrudStamp) => Site.KeyFromCrud(stamp),
        (item1: CrudStamp, item2: CrudStamp): number => {
            if (item1.d === undefined || item2.d === undefined) {
                throw "item should have deleted date string";
            }
            let item1D = new Date(item1.d);
            let item2D = new Date(item2.d);

            // order by recent
            return (item1D > item2D) ? 1 : 0; // more recent -> bigger -> lesser index
        });

    get deletedSiteList(): Array<CrudStamp> {
        return this._deletedSiteList.list;
    }

    // version
    v: string = '0.1.0';
    static curVer: string = '0.1.0'; // for checking

    constructor() { }

    addSite(site: Site) {
        this._siteList.add(site);
    }

    removeSite(site: Site) {
        let oldSite = this._siteList.get(site);

        if (oldSite === undefined) { throw "site does not exist"; }

        oldSite.d.d = new Date().toISOString();

        delete oldSite.d.u;

        this._deletedSiteList.add(oldSite.d);
        this._siteList.remove(oldSite);
    }

    static migrateOrCreate(siteState: SiteState | Array<object> | undefined | null): SiteState {
        if (siteState === null || typeof siteState === "undefined") {
            return new SiteState();
        }

        let curSiteState: SiteState;

        // migrate from 0.0.x
        if (Array.isArray(siteState)) {
            let sl = new SiteState();
            for (var siteObj of <Array<object>>siteState) {
                sl.addSite(new Site((<any>siteObj).url));
            }

            curSiteState = sl;
        } else {
            curSiteState = siteState;
        }

        curSiteState = SiteState.FromObject(curSiteState);

        while (curSiteState.v != this.curVer) {
            // do migrate
        }

        return curSiteState;
    }

    /**
     * merges siteState into this
     * @param siteState to merge with this
     */
    mergeWith(siteState: SiteState): SiteState {
        // merge sitelist
        siteState.siteListReadonly.forEach(site => {
            let thisSite = this._siteList.get(site);

            if (thisSite !== undefined) {
                if (site.d.u === undefined || thisSite.d.u === undefined) {
                    throw 'site should have always updated date';
                }

                // update
                if (new Date(thisSite.d.u) < new Date(site.d.u)) {
                    this._siteList.remove(thisSite);
                    this._siteList.add(site);
                }
            }
            // add
            else {
                this._siteList.add(site);
            }
        });

        // merge deleted list
        siteState.deletedSiteList.forEach(crud => {
            if (this._deletedSiteList.get(crud) === undefined) {
                this._siteList.removeByKey(Site.KeyFromCrud(crud));
                this._deletedSiteList.add(crud);
            }
        });

        // strip out deleted list
        this._deletedSiteList.list.forEach(crud => {
            this._siteList.removeByKey(Site.KeyFromCrud(crud));
        });

        return this;
    }

    static FromObject(siteState: object): SiteState {
        if (siteState instanceof SiteState) { return siteState; }

        let newObj = new SiteState();
        let _siteList = newObj._siteList;
        let _deletedSiteList = newObj._deletedSiteList;

        newObj = Object.assign(newObj, siteState);

        newObj._siteList = _siteList;
        newObj._siteList.list = ((siteState as any)._siteList as Array<object>).map(site => Site.FromObject(site));

        newObj._deletedSiteList = _deletedSiteList;
        newObj._deletedSiteList.list = (siteState as any)._deletedSiteList;

        return newObj;
    }

    toObject() {
        let newObj = Object.assign({}, this);

        newObj._siteList = this._siteList.list as any;
        newObj._deletedSiteList = this._deletedSiteList.list as any;

        return newObj;
    }
}
