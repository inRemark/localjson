import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.device-information.name'),
  title: translate('tools.device-information.title'),
  path: '/device-information',
  description: translate('tools.device-information.description'),
  keywords: translate('tools.device-information.keywords'),
  // [
  //   'device',
  //   'information',
  //   'screen',
  //   'pixel',
  //   'ratio',
  //   'status',
  //   'data',
  //   'computer',
  //   'size',
  //   'user',
  //   'agent',
  // ],
  component: () => import('./device-information.vue'),
  icon: DeviceDesktop,
});
