import type { RouteRecordRaw } from 'vue-router';
import { layouts } from '@/core/src/layouts/index';
import HomePage from '@/core/src/pages/Home.page.vue';
import NotFound from '@/core/src/pages/404.page.vue';
import { tools } from '@/core/src/tools';
import { config } from '@/core/src/config';
import { routes as demoRoutes } from '@/core/src/ui/demo/demo.routes';

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
}));
const toolsRedirectRoutes = tools
  .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
  .flatMap(
    ({ path, redirectFrom }) => redirectFrom?.map(redirectSource => ({ path: redirectSource, redirect: path })) ?? [],
  );

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/core/src/pages/About.vue'),
  },
  {
    path: '/apps',
    name: 'apps',
    component: () => import('@/core/src/pages/Apps.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@/core/src/pages/Download.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('./pages/Terms.vue'),
  },
  ...toolsRoutes,
  ...toolsRedirectRoutes,
  ...(config.app.env === 'development' ? demoRoutes : []),
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];
