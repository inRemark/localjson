import type { RouteRecordRaw } from 'vue-router';
import { layouts } from '@localjson/core/layouts/index';
import HomePage from '@localjson/core/pages/Home.page.vue';
import NotFound from '@localjson/core/pages/404.page.vue';
import { tools } from '@localjson/core/tools';
import { config } from '@localjson/core/config';
import { routes as demoRoutes } from '@localjson/core/ui/demo/demo.routes';

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
    component: () => import('@localjson/core/pages/About.vue'),
  },
  {
    path: '/apps',
    name: 'apps',
    component: () => import('@localjson/core/pages/Apps.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@localjson/core/pages/Download.vue'),
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
