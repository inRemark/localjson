import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.xml-to-json.name'),
  title: translate('tools.xml-to-json.title'),
  path: '/xml-to-json',
  description: translate('tools.xml-to-json.description'),
  keywords: translate('tools.xml-to-json.keywords'),//['xml', 'to', 'json'],
  component: () => import('./xml-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-09'),
});
