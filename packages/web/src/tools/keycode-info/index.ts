import { Keyboard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.keycode-info.name'),
  title: translate('tools.keycode-info.title'),
  path: '/keycode-info',
  description: translate('tools.keycode-info.description'),
  keywords: translate('tools.keycode-info.description'),
  // [
  //   'keycode',
  //   'info',
  //   'code',
  //   'javascript',
  //   'event',
  //   'keycodes',
  //   'which',
  //   'keyboard',
  //   'press',
  //   'modifier',
  //   'alt',
  //   'ctrl',
  //   'meta',
  //   'shift',
  // ],
  component: () => import('./keycode-info.vue'),
  icon: Keyboard,
});
