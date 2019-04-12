import { Site, SiteState } from '../common/types'

const siteStateKey = 'sites';

export interface MsgFromStorage {
  kind: string,
  payload: any | SiteState
}

interface StoragePayload {
  sites: SiteState | Array<string>
}

export class StorageManager {
  async addSite(site: Site) {
    let localSiteState: SiteState = await this.getLocalState();

    localSiteState.addSite(site);

    this.setAllStateAndNotify(localSiteState);
  }

  async removeSite(site: Site) {
    let localSiteState = await this.getLocalState();

    localSiteState.removeSite(site);

    this.setAllStateAndNotify(localSiteState);
  }

  private messageUpdate(siteState: SiteState) {
    browser.runtime.sendMessage({ kind: 'update', payload: siteState.toObject() });
  }

  private async getLocalState(): Promise<SiteState> {
    let storageObj = await browser.storage.local.get(siteStateKey);

    let localSiteState = storageObj[siteStateKey];

    let siteState: SiteState = SiteState.migrateOrCreate(<any>localSiteState);

    // if migrated, update current local state.
    let beforeVer = typeof localSiteState === "undefined" ? undefined : (<any>localSiteState).v;
    let newVer = siteState.v;

    if (beforeVer !== newVer) {
      // ver 0.0.x
      if (typeof beforeVer === "undefined") {
        return await this.setAllStateAndNotify(siteState);
      }

      await this.setLocalState(siteState);
      return siteState;
    }

    return siteState;
  }

  private async setLocalState(siteState: SiteState) {
    try {
      let payload = {} as StoragePayload;
      payload[siteStateKey] = siteState.toObject();

      await browser.storage.local.set(<any>payload);
    }
    catch (ex) {
      console.error(ex);
    }
  }

  private async getSyncState(): Promise<SiteState> {
    try {
      let storageObj = await browser.storage.sync.get(siteStateKey);
      let syncSiteState = storageObj[siteStateKey];

      let siteState: SiteState = SiteState.migrateOrCreate(<any>syncSiteState);
      return siteState;
    }
    catch (ex) {
      console.error(ex);
      return new SiteState();
    }
  }

  private async setSyncState(siteState: SiteState) {

    let payload = {} as StoragePayload;
    payload[siteStateKey] = siteState.toObject();

    await browser.storage.sync.set(<any>payload);
  }

  async updateFromStorage() {
    let localSiteState = await this.getLocalState();
    this.messageUpdate(localSiteState);

    return await this.mergeLocalWithSync();
  }

  private async setAllStateAndNotify(siteState: SiteState): Promise<SiteState> {
    await this.setLocalState(siteState);

    let mergedState = await this.mergeLocalWithSync();

    return mergedState;
  }

  private async mergeLocalWithSync(): Promise<SiteState> {
    let localSiteState = await this.getLocalState();

    let mergedState: SiteState;

    if (browser.storage.sync !== undefined) {
      let syncState = await this.getSyncState();

      mergedState = localSiteState.mergeWith(syncState);
    } else {
      mergedState = localSiteState;
    }

    await this.setLocalState(mergedState);
    this.messageUpdate(mergedState);
    await this.setSyncState(mergedState);

    return mergedState;
  }
}

(<any>window).storageManager = new StorageManager();