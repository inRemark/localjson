import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.base64-file-converter.name'),
  title: translate('tools.base64-file-converter.title'),
  path: '/base64-file-converter',
  description: translate('tools.base64-file-converter.description'),
  keywords: translate('tools.base64-file-converter.keywords'), //['base64', 'converter', 'upload', 'image', 'file', 'conversion', 'web', 'data', 'format'],
  component: () => import('./base64-file-converter.vue'),
  icon: FileDigit,
});
