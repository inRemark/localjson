import type { RouteRecordRaw } from 'vue-router';
import { layouts } from '@/core/layouts/index';
import HomePage from '@/core/pages/Home.page.vue';
import NotFound from '@/core/pages/404.page.vue';
import { tools } from '@/core/tools';
import { config } from '@/core/config';
import { routes as demoRoutes } from '@/core/ui/demo/demo.routes';

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.tool, name, ...config },
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
    component: () => import('@/core/pages/About.vue'),
  },
  {
    path: '/apps',
    name: 'apps',
    component: () => import('@/core/pages/Apps.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@/core/pages/Download.vue'),
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
