import Vue from 'vue'

import { store } from './store';
import App from './components/App.vue';

let vue = new Vue({
    el: '#app',
    store: store,
    render: h => h(App)
});

vue.$store.dispatch('updateFromStorage');
