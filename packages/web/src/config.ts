import { defineConfig } from 'figue';
import { z } from 'zod';

export const { config } = defineConfig(
  {
    app: {
      version: {
        doc: 'Application current version',
        schema: z.string(),
        default: '0.0.0',
        env: 'PACKAGE_VERSION',
      },
      lastCommitSha: {
        doc: 'Application last commit SHA version',
        schema: z.string(),
        default: '',
        env: 'VITE_VERCEL_GIT_COMMIT_SHA',
      },
      baseUrl: {
        doc: 'Application base url',
        schema: z.string(),
        default: '/',
        env: 'BASE_URL',
      },
      env: {
        doc: 'Application current env',
        schema: z.enum(['production', 'development', 'preview', 'test']),
        default: 'production',
        env: 'VITE_VERCEL_ENV',
      },
    },
    plausible: {
      isTrackerEnabled: {
        doc: 'Is the tracker enabled',
        schema: z.union([z.boolean(), z.string().transform(val => val === 'true')]),
        default: false,
        env: 'VITE_TRACKER_ENABLED',
      },
      domain: {
        doc: 'Plausible current domain',
        schema: z.string(),
        default: '',
        env: 'VITE_PLAUSIBLE_DOMAIN',
      },
      apiHost: {
        doc: 'Plausible remote api host',
        schema: z.string(),
        default: '',
        env: 'VITE_PLAUSIBLE_API_HOST',
      },
      trackLocalhost: {
        doc: 'Enable or disable localhost tracking by plausible',
        schema: z.union([z.boolean(), z.string().transform(val => val === 'true')]),
        default: false,
      },
    },
    showBanner: {
      doc: 'Show the banner',
      schema: z.union([z.boolean(), z.string().transform(val => val === 'true')]),
      default: false,
      env: 'VITE_SHOW_BANNER',
    },
  },
  {
    envSource: {
      ...import.meta.env,
      // Because the string 'import.meta.env.PACKAGE_VERSION' is statically replaced during build time (see 'define' in vite.config.ts)
      PACKAGE_VERSION: import.meta.env.PACKAGE_VERSION,
    },
  },
);
