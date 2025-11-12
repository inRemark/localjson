import { HttpRound } from '@vicons/material';
import { defineTool } from '../tool';

import { codesByCategories } from './http-status-codes.constants';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.http-status-codes.name'),
  title: translate('tools.http-status-codes.title'),
  path: '/http-status-codes',
  description: translate('tools.http-status-codes.description'),
  keywords: translate('tools.http-status-codes.keywords'),
  // [
  //   'http',
  //   'status',
  //   'codes',
  //   ...codesByCategories.flatMap(({ codes }) => codes.flatMap(({ code, name }) => [String(code), name])),
  // ],
  component: () => import('./http-status-codes.vue'),
  icon: HttpRound,
  createdAt: new Date('2023-04-13'),
});
