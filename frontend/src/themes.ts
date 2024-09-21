import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#5a97fc',
    primaryColorHover: '#5a97fc',
    primaryColorPressed: '#5a97fc',
    primaryColorSuppl: '#5a97fc',
  },
  Menu: {
    itemHeight: '32px',
  },

  Layout: { color: '#f1f5f9' },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px' },
    },
  },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#1ea54cFF',
    // primaryColorHover: '#36AD6AFF',
    // primaryColorPressed: '#0C7A43FF',
    // primaryColorSuppl: '#36AD6AFF',

    primaryColor: '#5a97fc',
    primaryColorHover: '#5a97fc',
    primaryColorPressed: '#5a97fc',
    primaryColorSuppl: '#5a97fc',
  },

  Notification: {
    color: '#333333',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#1e1e1e' },
    },
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#1c1c1c',
    siderColor: '#232323',
    siderBorderColor: 'transparent',
  },

  Card: {
    color: '#232323',
    borderColor: '#282828',
  },

  Table: {
    tdColor: '#232323',
    thColor: '#353535',
  },
};
