import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.uuid-generator.name'),
  title: translate('tools.uuid-generator.title'),
  path: '/uuid-generator',
  description: translate('tools.uuid-generator.description'),
  keywords: translate('tools.uuid-generator.keywords'),//['uuid', 'generator', 'unique', 'identifier'],
  component: () => import('./uuid-generator.vue'),
  icon: Fingerprint,
});
