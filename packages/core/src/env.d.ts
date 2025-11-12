/// <reference types="vite/client" />

interface ImportMetaEnv {
  PACKAGE_VERSION: string;
  VITE_VERCEL_GIT_COMMIT_SHA: string;
  BASE_URL: string;
  VITE_VERCEL_ENV: 'production' | 'development' | 'preview' | 'test';
  VITE_TRACKER_ENABLED: string;
  VITE_PLAUSIBLE_DOMAIN: string;
  VITE_PLAUSIBLE_API_HOST: string;
  VITE_SHOW_BANNER: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}