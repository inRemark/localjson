/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
/// <reference types="vite-ssg/client" />

// Google Analytics global types
interface Window {
  gtag?: (
    command: 'event' | 'config' | 'set' | 'js',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];
}

interface ImportMetaEnv {
  VITE_PLAUSIBLE_API_HOST: string;
  VITE_PLAUSIBLE_DOMAIN: string;
  VITE_GA_MEASUREMENT_ID?: string;
  PACKAGE_VERSION: string;
  GIT_SHORT_SHA: string;
  PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
