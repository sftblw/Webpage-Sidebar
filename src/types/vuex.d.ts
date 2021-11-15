// vuex.d.ts
import { Store } from 'vuex'
import { SiteState } from '../common/siteState';

declare module '@vue/runtime-core' {
    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<SiteState>
    }
}
