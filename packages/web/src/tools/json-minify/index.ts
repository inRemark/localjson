import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-minify.name'),
  title: translate('tools.json-minify.title'),
  path: '/json-minify',
  description: translate('tools.json-minify.description'),
  keywords: translate('tools.json-minify.keywords'),//['json', 'minify', 'format'],
  component: () => import('./json-minify.vue'),
  icon: Braces,
});
