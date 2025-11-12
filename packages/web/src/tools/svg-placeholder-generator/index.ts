import { ImageOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.svg-placeholder-generator.name'),
  title: translate('tools.svg-placeholder-generator.title'),
  path: '/svg-placeholder-generator',
  description: translate('tools.svg-placeholder-generator.description'),
  keywords: translate('tools.svg-placeholder-generator.keywords'),
  // ['svg', 'placeholder', 'generator', 'image', 'size', 'mockup'],
  component: () => import('./svg-placeholder-generator.vue'),
  icon: ImageOutlined,
});
