import { resolve } from 'node:path';
import { URL, fileURLToPath } from 'node:url';

import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import type { ViteSSGOptions } from 'vite-ssg';
import { VitePWA } from 'vite-plugin-pwa';
// @ts-ignore - vite-plugin-vue-markdown has type definition issues
import VitePluginMarkdown from 'vite-plugin-vue-markdown';
import svgLoader from 'vite-svg-loader';
import { configDefaults } from 'vitest/config';

const baseUrl = process.env.BASE_URL ?? '/';

/**
 * Routes that are known to be incompatible with SSG/SSR for now.
 * These routes will still work in CSR mode, but won't be pre-rendered into HTML during SSG.
 *
 * NOTE:
 * - Keep these paths in sync with the corresponding tool definitions in `@/core/tools`.
 * - Once a tool is made SSR-safe, remove it from this list so it can benefit from SSG.
 */
const SSG_EXCLUDED_ROUTE_SUBSTRINGS = [
  '/bip39-generator',
  '/ascii-text-drawer',
  '/device-information',
  '/sql-prettify',
  '/text-diff',
] as const;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      strictMessage: false,
      include: [
        resolve(__dirname, '../core/locales/**'),
      ],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Icons({ compiler: 'vue3' }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    // @ts-ignore - vite-plugin-vue-markdown has type definition issues
    VitePluginMarkdown(),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        // Exclude static files from navigation fallback (Service Worker won't intercept them)
        navigateFallbackDenylist: [
          /^\/sitemap\.xml$/,
          /^\/robots\.txt$/,
          /\.xml$/,
          /\.txt$/,
        ],
        // Don't cache sitemap.xml and robots.txt - let them pass through directly
        // These files should be excluded from Service Worker interception
      },
      manifest: {
        name: 'LocalJson',
        description: 'Aggregated set of useful tools for developers.',
        display: 'standalone',
        lang: 'fr-FR',
        start_url: `${baseUrl}?utm_source=pwa&utm_medium=pwa`,
        orientation: 'any',
        theme_color: '#18a058',
        background_color: '#f1f5f9',
        icons: [
          {
            src: '/favicon-16x16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: '/favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    Components({
      dirs: ['../core/src/'],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'icon' })],
    }),
    Unocss(),
  ],
  base: baseUrl,
  resolve: {
    alias: {
      '@/core': fileURLToPath(new URL('../core/src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  optimizeDeps: {
    include: [
      'qrcode',
      'mime-types',
      'json5',
      'pdf-signature-reader',
      'highlight.js/lib/languages/javascript',
      'highlight.js/lib/languages/python',
      'highlight.js/lib/languages/sql',
      'highlight.js/lib/languages/xml',
      'highlight.js/lib/languages/yaml',
      'highlight.js/lib/languages/ini',
      'ulid',
      '@it-tools/bip39',
    ],
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  test: {
    exclude: [...configDefaults.exclude, '**/*.e2e.spec.ts'],
  },
  build: {
    target: 'esnext',
  },
  preview: {
    port: 5050,
    // Ensure static files like sitemap.xml are served directly
    // without being caught by SPA fallback
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  },
  ssr: {
    noExternal: ['naive-ui', '@vueuse/core', '@vueuse/head', 'vue-i18n'],
  },
  ssgOptions: {
    formatting: 'minify',
    dirStyle: 'nested',
    mock: true,
    // Exclude tool pages that are known to be incompatible with SSG for now.
    includedRoutes(paths) {
      return paths.filter(path => !SSG_EXCLUDED_ROUTE_SUBSTRINGS.some(excluded => path.includes(excluded)));
    },
    // Inject Google Analytics to all pre-rendered pages
    onPageRendered: (_route: string, html: string) => {
      const gaId = process.env.VITE_GA_MEASUREMENT_ID || 'G-PXPC8P2K6C';
      
      // Inject GA script before </head>
      return html.replace(
        '</head>',
        `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId}');
</script>
</head>`,
      );
    },
    // Generate sitemap after all pages are rendered
    async onFinished() {
      const hostname = 'https://localjson.cn';
      const fs = await import('node:fs');
      const path = await import('node:path');
      
      // Read all generated HTML files
      const distDir = path.resolve(__dirname, 'dist');
      const routes: string[] = [];
      
      // Recursively find all index.html files
      function findHtmlFiles(dir: string, baseDir: string = dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            findHtmlFiles(filePath, baseDir);
          } else if (file === 'index.html') {
            // Convert file path to URL path
            let urlPath = path.relative(baseDir, dir);
            urlPath = urlPath ? `/${urlPath}` : '/';
            urlPath = urlPath.replaceAll('\\', '/'); // Windows path fix
            routes.push(urlPath);
          }
        }
      }
      
      findHtmlFiles(distDir);
      
      // Generate sitemap XML
      const now = new Date().toISOString();
      const urlEntries = routes
        .filter(route => {
          // Exclude 404, catch-all routes, and invalid paths
          return !route.includes('/404') 
            && !route.includes(':pathMatch')
            && !route.includes(':')
            && route !== '/:pathMatch(.*)*';
        })
        .map(route => {
          const priority = route === '/' ? '1.0' : '0.8';
          const url = `${hostname}${route}`;
          return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
        })
        .join('\n');
      
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;
      
      // Write sitemap.xml
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
      
      console.log(`✓ Generated sitemap.xml with ${routes.length} routes`);
    },
  } as ViteSSGOptions,
});
