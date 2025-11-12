import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.lorem-ipsum-generator.name'),
  title: translate('tools.lorem-ipsum-generator.title'),
  path: '/lorem-ipsum-generator',
  description: translate('tools.lorem-ipsum-generator.description'),
  keywords: translate('tools.lorem-ipsum-generator.keywords'),//['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'placeholder', 'text', 'filler', 'random', 'generator'],
  component: () => import('./lorem-ipsum-generator.vue'),
  icon: AlignJustified,
});
