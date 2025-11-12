import { Hourglass } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.eta-calculator.name'),
  title: translate('tools.eta-calculator.title'),
  path: '/eta-calculator',
  description: translate('tools.eta-calculator.description'),
  keywords: translate('tools.eta-calculator.keywords'), //['eta', 'calculator', 'estimated', 'time', 'arrival', 'average'],
  component: () => import('./eta-calculator.vue'),
  icon: Hourglass,
});
