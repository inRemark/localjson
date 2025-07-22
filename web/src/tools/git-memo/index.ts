import { BrandGit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.git-memo.name'),
  title: translate('tools.git-memo.title'),
  path: '/git-memo',
  description: translate('tools.git-memo.description'),
  keywords: translate('tools.git-memo.keywords'),//['git', 'push', 'force', 'pull', 'commit', 'amend', 'rebase', 'merge', 'reset', 'soft', 'hard', 'lease'],
  component: () => import('./git-memo.vue'),
  icon: BrandGit,
});
