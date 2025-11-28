import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createRouter, createWebHashHistory } from 'vue-router';

import 'virtual:uno.css';
import { naive } from '@/core/plugins/naive.plugin';
import App from '@/core/App.vue';
import { setPlatformAdapter } from '@/core/adapters';
import { desktopAdapter } from '@/core/adapters/desktop';
import { i18nPlugin } from '@/core/plugins/i18n.plugin';
import { plausible } from '@/core/plugins/plausible.plugin';

import { routes } from './router';

// initialize platform adapter
setPlatformAdapter(desktopAdapter);

const app = createApp(App);
app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(plausible);


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

app.use(router);
app.use(naive);

app.mount('#app');

if (import.meta.env.DEV) {
  console.log('[Desktop] Application started');
  console.log('[Desktop] Platform adapter:', desktopAdapter.type);
}
