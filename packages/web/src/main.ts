import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createRouter, createWebHistory } from 'vue-router';

import { registerSW } from 'virtual:pwa-register';
import { plausible } from '@localjson/core/plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from '@localjson/core/plugins/naive.plugin';

// 导入核心应用
import App from '@localjson/core/App.vue';

// 导入并设置 Web 适配器
import { setPlatformAdapter, webAdapter } from '@localjson/core/adapters';

// 导入路由配置
import { routes } from './router';
import { i18nPlugin } from '@localjson/core/plugins/i18n.plugin';
import { config } from '@localjson/core/config';

registerSW();

// 初始化平台适配器
setPlatformAdapter(webAdapter);

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);

// 创建路由（Web 使用 history 模式）
const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes,
});
app.use(router);
app.use(naive);
app.use(plausible);

app.mount('#app');

// 开发环境日志
if (import.meta.env.DEV) {
  console.log('[Web] Application started');
  console.log('[Web] Platform adapter:', webAdapter.type);
}
