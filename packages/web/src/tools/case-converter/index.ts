import { LetterCaseToggle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.case-converter.name'),
  title: translate('tools.case-converter.title'),
  path: '/case-converter',
  description: translate('tools.case-converter.description'),
  keywords: translate('tools.case-converter.keywords'),
  // [
  //   'case',
  //   'converter',
  //   'camelCase',
  //   'capitalCase',
  //   'constantCase',
  //   'dotCase',
  //   'headerCase',
  //   'noCase',
  //   'paramCase',
  //   'pascalCase',
  //   'pathCase',
  //   'sentenceCase',
  //   'snakeCase',
  // ],
  component: () => import('./case-converter.vue'),
  icon: LetterCaseToggle,
});
