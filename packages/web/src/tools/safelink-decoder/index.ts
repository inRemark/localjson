import { Mailbox } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.safelink-decoder.name'),
  title: translate('tools.safelink-decoder.title'),
  path: '/safelink-decoder',
  description: translate('tools.safelink-decoder.description'),
  keywords: translate('tools.safelink-decoder.keywords'),
  // ['outlook', 'safelink', 'decoder'],
  component: () => import('./safelink-decoder.vue'),
  icon: Mailbox,
  createdAt: new Date('2024-03-11'),
});
