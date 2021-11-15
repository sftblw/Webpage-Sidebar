import { createApp } from 'vue';
import { store } from './store';
import Launcher from './components/Launcher.vue';

const app = createApp(Launcher);

app.use(store);
app.mount('#app')

store.dispatch('updateFromStorage');
