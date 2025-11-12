import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.string-obfuscator.name'),
  title: translate('tools.string-obfuscator.title'),
  path: '/string-obfuscator',
  description: translate('tools.string-obfuscator.description'),
  keywords: translate('tools.string-obfuscator.keywords'),
  // ['string', 'obfuscator', 'secret', 'token', 'hide', 'obscure', 'mask', 'masking'],
  component: () => import('./string-obfuscator.vue'),
  icon: EyeOff,
  createdAt: new Date('2023-08-16'),
});
