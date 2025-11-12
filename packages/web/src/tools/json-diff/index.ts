import { CompareArrowsRound } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-diff.name'),
  title: translate('tools.json-diff.title'),
  path: '/json-diff',
  description: translate('tools.json-diff.description'),
  keywords: translate('tools.json-diff.keywords'),//['json', 'diff', 'compare', 'difference', 'object', 'data'],
  component: () => import('./json-diff.vue'),
  icon: CompareArrowsRound,
  createdAt: new Date('2023-04-20'),
});
