import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

import { presetScrollbar } from 'unocss-preset-scrollbar';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetScrollbar({
      scrollbarTrackColor: 'rgb(229 229 229)',
      scrollbarThumbColor: 'rgb(209 213 219)',
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: '#5a97fc',

    },
  },
  shortcuts: {
    'pretty-scrollbar': 'scrollbar scrollbar-rounded',
    'divider': 'h-1px bg-current op-10',
    'bg-surface': 'bg-#ffffff dark:bg-#232323',
    'bg-background': 'bg-#f1f5f9 dark:bg-#1c1c1c',
  },
});
