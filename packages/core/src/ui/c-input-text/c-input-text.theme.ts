import { defineThemes } from '../theme/theme.models';

const sizes = {
  small: {
    height: '28px',
    fontSize: '12px',
  },
  medium: {
    height: '34px',
    fontSize: '14px',
  },
  large: {
    height: '40px',
    fontSize: '16px',
  },
};

export const { useTheme } = defineThemes({
  dark: {
    sizes,
    backgroundColor: '#333333',
    borderColor: '#333333',

    focus: {
      backgroundColor: '#5a97fc1f',
    },
  },
  light: {
    sizes,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e69e',

    focus: {
      backgroundColor: '#ffffff',
    },
  },
});
