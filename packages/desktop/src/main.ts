import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createRouter, createWebHashHistory } from 'vue-router';

console.log('[Desktop] Starting application initialization...');

import 'virtual:uno.css';

import { naive } from '@/plugins/naive.plugin';

console.log('[Desktop] Importing core App...');
// 导入核心应用
import App from '@/App.vue';

console.log('[Desktop] Importing adapters...');
// 导入并设置 Desktop 适配器
import { setPlatformAdapter, desktopAdapter } from '@/adapters';

// 导入路由配置
import { routes } from './router';
import { i18nPlugin } from '@/plugins/i18n.plugin';
import { plausible } from '@/plugins/plausible.plugin';

console.log('[Desktop] Setting platform adapter...');
// 初始化平台适配器
setPlatformAdapter(desktopAdapter);

console.log('[Desktop] Creating Vue app...');
const app = createApp(App);

console.log('[Desktop] Installing plugins...');
app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(plausible);

// 创建路由（Desktop 使用 hash 模式）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

console.log('[Desktop] Routes:', routes.length);
app.use(router);
app.use(naive);

console.log('[Desktop] Mounting app...');
app.mount('#app');

console.log('[Desktop] Application mounted successfully!');
// 开发环境日志
if (import.meta.env.DEV) {
  console.log('[Desktop] Application started');
  console.log('[Desktop] Platform adapter:', desktopAdapter.type);
}
