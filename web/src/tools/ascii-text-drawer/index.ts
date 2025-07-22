import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ascii-text-drawer.name'), 
  title: translate('tools.ascii-text-drawer.title'),
  path: '/ascii-text-drawer',
  description: translate('tools.ascii-text-drawer.keywords'), //'Create ASCII art text with many fonts and styles.',
  keywords: translate('tools.ascii-text-drawer.keywords'),
  // ['ascii', 'asciiart', 'text', 'drawer'],
  component: () => import('./ascii-text-drawer.vue'),
  icon: Artboard,
  createdAt: new Date('2024-03-03'),
});
