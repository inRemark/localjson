import { Server } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.random-port-generator.name'),
  title: translate('tools.random-port-generator.title'),
  path: '/random-port-generator',
  description: translate('tools.random-port-generator.description'),
  keywords: translate('tools.random-port-generator.keywords'),
  // ['system', 'port', 'lan', 'generator', 'random', 'development', 'computer'],
  component: () => import('./random-port-generator.vue'),
  icon: Server,
});
