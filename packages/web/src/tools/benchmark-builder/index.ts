import { SpeedFilled } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.benchmark-builder.name'),
  title: translate('tools.benchmark-builder.title'),
  path: '/benchmark-builder',
  description: translate('tools.benchmark-builder.description'),
  keywords: translate('tools.benchmark-builder.keywords'),//['benchmark', 'builder', 'execution', 'duration', 'mean', 'variance'],
  component: () => import('./benchmark-builder.vue'),
  icon: SpeedFilled,
  createdAt: new Date('2023-04-05'),
});
