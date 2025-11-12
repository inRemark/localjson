import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createRouter, createWebHashHistory } from 'vue-router';

import 'virtual:uno.css';

import { naive } from '@localjson/core/plugins/naive.plugin';

// 导入核心应用
import App from '@localjson/core/App.vue';

// 导入并设置 Desktop 适配器
import { setPlatformAdapter, desktopAdapter } from '@localjson/core/adapters';

// 导入路由配置
import { routes } from './router';
import { i18nPlugin } from '@localjson/core/plugins/i18n.plugin';

// 初始化平台适配器
setPlatformAdapter(desktopAdapter);

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);

// 创建路由（Desktop 使用 hash 模式）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
app.use(router);
app.use(naive);

app.mount('#app');

// 开发环境日志
if (import.meta.env.DEV) {
  console.log('[Desktop] Application started');
  console.log('[Desktop] Platform adapter:', desktopAdapter.type);
}
