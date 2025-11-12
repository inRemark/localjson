import { Tags } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.og-meta-generator.name'),
  title: translate('tools.og-meta-generator.title'),
  path: '/og-meta-generator',
  description: translate('tools.og-meta-generator.description'),
  keywords: translate('tools.og-meta-generator.keywords'),
  // [
  //   'meta',
  //   'tag',
  //   'generator',
  //   'social',
  //   'title',
  //   'description',
  //   'image',
  //   'share',
  //   'online',
  //   'website',
  //   'open',
  //   'graph',
  //   'og',
  // ],
  component: () => import('./meta-tag-generator.vue'),
  icon: Tags,
});
