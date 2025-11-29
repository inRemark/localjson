import { useDark, useMediaQuery, useToggle } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useStyleStore = defineStore('style', {
  state: () => {
    const isDarkTheme = useDark();
    const toggleDark = useToggle(isDarkTheme);
    const isSmallScreen = useMediaQuery('(max-width: 700px)');

    return {
      isDarkTheme,
      toggleDark,
      isSmallScreen,
    };
  },
});

