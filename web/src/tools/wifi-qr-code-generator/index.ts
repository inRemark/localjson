import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.wifi-qrcode-generator.name'),
  title: translate('tools.wifi-qrcode-generator.title'),
  path: '/wifi-qrcode-generator',
  description: translate('tools.wifi-qrcode-generator.description'),
  keywords: translate('tools.wifi-qrcode-generator.keywords'),//['wifi', 'qr', 'code', 'generator'],
  component: () => import('./wifi-qr-code-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2023-09-06'),
});
