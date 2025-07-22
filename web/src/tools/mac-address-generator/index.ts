import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mac-address-generator.name'),
  title: translate('tools.mac-address-generator.title'),
  path: '/mac-address-generator',
  description: translate('tools.mac-address-generator.description'),
  keywords: translate('tools.mac-address-generator.keywords'),//['mac', 'address', 'generator', 'random', 'prefix'],
  component: () => import('./mac-address-generator.vue'),
  icon: Devices,
  createdAt: new Date('2023-11-31'),
});
