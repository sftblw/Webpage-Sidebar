import { createStore } from 'vuex'
import { Site, SiteState } from '../common/types'
import { StorageManager, MsgFromStorage } from '../background/storage'

const isDebug = process.env.NODE_ENV !== 'production';

let _storageManager: StorageManager | null = null;
const getStorageManager = async function () {
    if (_storageManager !== null) { return _storageManager; }

    let bgScript = await browser.runtime.getBackgroundPage();
    _storageManager = <StorageManager>(<any>bgScript).storageManager;
    return _storageManager;
}

const store = createStore<SiteState>({
    // data
    state() { return new SiteState() },
    // "message": actual state tree morpher
    mutations: {
        replaceSites(_: SiteState, newSiteState: SiteState): void {
            store.replaceState(newSiteState);
        }
    },
    // "async message": creates message
    actions: {
        async addSite(_, site: Site) {
            let manager = await getStorageManager();
            manager.addSite(site);
        },
        async removeSite(_, site: Site) {
            let manager = await getStorageManager()
            manager.removeSite(site);
        },
        async updateFromStorage() {
            let manager = await getStorageManager()
            manager.updateFromStorage();
        }
    },
    getters: {},
    strict: isDebug
});

browser.runtime.onMessage.addListener((msg: object) => {
    let message = <MsgFromStorage>msg;

    if (message.kind === 'update') {
        store.commit('replaceSites', SiteState.FromObject(message.payload));
    }
});

export { store };