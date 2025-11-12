import { FileDiff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-diff.name'),
  title: translate('tools.text-diff.title'),
  path: '/text-diff',
  description: translate('tools.text-diff.description'),
  keywords: translate('tools.text-diff.keywords'),
  // ['text', 'diff', 'compare', 'string', 'text diff', 'code'],
  component: () => import('./text-diff.vue'),
  icon: FileDiff,
  createdAt: new Date('2023-08-16'),
});
