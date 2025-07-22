import { FileInvoice } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.chmod-calculator.name'),
  title: translate('tools.chmod-calculator.title'),
  path: '/chmod-calculator',
  description: translate('tools.chmod-calculator.description'),
  keywords: translate('tools.chmod-calculator.keywords'),
  // [
  //   'chmod',
  //   'calculator',
  //   'file',
  //   'permission',
  //   'files',
  //   'directory',
  //   'folder',
  //   'recursive',
  //   'generator',
  //   'octal',
  // ],
  component: () => import('./chmod-calculator.vue'),
  icon: FileInvoice,
});
