import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createRouter, createWebHistory } from 'vue-router';

import { registerSW } from 'virtual:pwa-register';
import { plausible } from '@/core/plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from '@/core/plugins/naive.plugin';
import App from '@/core/App.vue';
import { setPlatformAdapter } from '@/core/adapters';
import { webAdapter } from '@/core/adapters/web';

import { i18nPlugin } from '@/core/plugins/i18n.plugin';
import { config } from '@/core/config';

import { routes } from './router';
registerSW();

// initialize platform adapter
setPlatformAdapter(webAdapter);

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);

/**
 * Create router (Web uses hash mode)
 * TODO: Consider whether to support history mode
 */
const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes,
});
app.use(router);
app.use(naive);
app.use(plausible);

app.mount('#app');

if (import.meta.env.DEV) {
  console.log('[Web] Application started');
  console.log('[Web] Platform adapter:', webAdapter.type);
}
