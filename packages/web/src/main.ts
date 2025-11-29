import { ViteSSG } from 'vite-ssg';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import { plausible } from '@/core/plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from '@/core/plugins/naive.plugin';
import App from '@/core/App.vue';
import { setPlatformAdapter } from '@/core/adapters';
import { webAdapter } from '@/core/adapters/web';

import { i18nPlugin } from '@/core/plugins/i18n.plugin';
import { config } from '@/core/config';

import { routes } from './router';

// Export ViteSSG factory function
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: config.app.baseUrl,
  },
  ({ app, router, routes, isClient, initialState }) => {
    // Initialize platform adapter
    setPlatformAdapter(webAdapter);

    // Configure plugins (both SSR and CSR)
    app.use(createPinia());
    app.use(createHead());
    app.use(i18nPlugin);
    app.use(naive);
    app.use(plausible);

    // Client-only setup
    if (isClient) {
      if (import.meta.env.DEV) {
        console.log('[Web] Application started');
        console.log('[Web] Platform adapter:', webAdapter.type);
      }
    }
  },
);
