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
    // Inject Google Analytics and fix title/meta for tool pages
    onPageRendered: async (route: string, html: string) => {
      const gaId = process.env.VITE_GA_MEASUREMENT_ID || 'G-PXPC8P2K6C';
      
      // Try to extract tool name from route and get translation
      let modifiedHtml = html;
      const routePath = route.trim().replace(/^\//, '').replaceAll('/', '-');
      
      // Only process tool pages (non-empty route path and not home/about/etc)
      if (routePath && routePath !== 'about' && routePath !== 'apps' && routePath !== 'download' && routePath !== 'privacy') {
        try {
          // Load translation file and tools index to map redirect paths
          const fs = await import('node:fs');
          const path = await import('node:path');
          const yaml = await import('js-yaml');
          
          const localesPath = path.resolve(__dirname, '../core/locales/en.yml');
          const localesContent = fs.readFileSync(localesPath, 'utf-8');
          const locales = yaml.load(localesContent) as { tools?: Record<string, { title?: string; description?: string }> };
          
          // Load all tool definition files to map redirect paths to actual tool paths
          const toolsDir = path.resolve(__dirname, '../core/src/tools');
          const toolDirs = fs.readdirSync(toolsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
          
          // Build a map from redirect paths to actual tool paths
          const redirectToToolMap = new Map<string, string>();
          
          for (const toolDir of toolDirs) {
            const toolIndexPath = path.join(toolsDir, toolDir, 'index.ts');
            if (!fs.existsSync(toolIndexPath)) continue;
            
            try {
              const toolContent = fs.readFileSync(toolIndexPath, 'utf-8');
              const pathMatch = toolContent.match(/path:\s*['"]([^'"]+)['"]/);
              if (!pathMatch) continue;
              
              const toolPath = pathMatch[1].replace(/^\//, '').replaceAll('/', '-');
              const redirectMatch = toolContent.match(/redirectFrom:\s*\[([^\]]+)\]/);
              
              if (redirectMatch) {
                const redirects = Array.from(redirectMatch[1].matchAll(/['"]([^'"]+)['"]/g));
                for (const redirect of redirects) {
                  const redirectPath = redirect[1].replace(/^\//, '').replaceAll('/', '-');
                  redirectToToolMap.set(redirectPath, toolPath);
                }
              }
            } catch (error) {
              // Skip if file can't be read
              continue;
            }
          }
          
          // Get the actual tool path (handle redirects)
          const actualToolPath = redirectToToolMap.get(routePath) || routePath;
          
          // Try to find translation for this route
          const toolTitle = locales?.tools?.[actualToolPath]?.title;
          const toolDescription = locales?.tools?.[actualToolPath]?.description;
          
          if (toolTitle) {
            const newTitle = `${toolTitle} - LocalJson Tools`;
            const newDescription = toolDescription || 'Collection of handy online tools for developers, with great UX.';
            
            // Replace title tag
            modifiedHtml = modifiedHtml.replace(
              /<title>.*?<\/title>/i,
              `<title>${newTitle}</title>`,
            );
            
            // Replace meta name="description"
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta name="description" content="${newDescription.replaceAll('"', '&quot;')}">`,
            );
            
            // Replace meta itemprop="name"
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+itemprop=["']name["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta itemprop="name" content="${newTitle.replaceAll('"', '&quot;')}">`,
            );
            
            // Replace meta itemprop="description"
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+itemprop=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta itemprop="description" content="${newDescription.replaceAll('"', '&quot;')}">`,
            );
            
            // Replace og:title
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta property="og:title" content="${newTitle.replaceAll('"', '&quot;')}">`,
            );
            
            // Replace og:description
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta property="og:description" content="${newDescription.replaceAll('"', '&quot;')}">`,
            );
            
            // Replace twitter:title
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta name="twitter:title" content="${newTitle.replaceAll('"', '&quot;')}">`,
            );
            
            // Replace twitter:description
            modifiedHtml = modifiedHtml.replace(
              /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
              `<meta name="twitter:description" content="${newDescription.replaceAll('"', '&quot;')}">`,
            );
          }
        } catch (error) {
          // If translation loading fails, continue with default HTML
          console.warn(`[SSG] Failed to load translation for route ${route}:`, error);
        }
      }
      
      // Preload CSS files to prevent FOUC (Flash of Unstyled Content)
      try {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const distDir = path.resolve(__dirname, 'dist');
        const assetsDir = path.join(distDir, 'assets');
        
        if (fs.existsSync(assetsDir)) {
          // Find all CSS files and sort them (app CSS first, then others)
          const cssFiles = fs.readdirSync(assetsDir)
            .filter(file => file.endsWith('.css'))
            .sort((a, b) => {
              // Prioritize app CSS file
              if (a.startsWith('app-')) return -1;
              if (b.startsWith('app-')) return 1;
              return a.localeCompare(b);
            });
          
          if (cssFiles.length > 0) {
            // Generate preload link tags with async loading fallback
            const preloadLinks = cssFiles.map(cssFile => 
              `    <link rel="preload" href="/assets/${cssFile}" as="style" onload="this.onload=null;this.rel='stylesheet'">`
            ).join('\n');
            
            // Generate noscript fallback for browsers without JavaScript
            const noscriptLinks = cssFiles.map(cssFile => 
              `    <link rel="stylesheet" href="/assets/${cssFile}">`
            ).join('\n');
            
            // Inject preload links and noscript fallback before </head>
            modifiedHtml = modifiedHtml.replace(
              '</head>',
              `${preloadLinks}
    <noscript>${noscriptLinks}</noscript>
</head>`,
            );
          }
        }
      } catch (error) {
        console.warn('[SSG] Failed to preload CSS:', error);
      }
      
      // Inject GA script before </head>
      return modifiedHtml.replace(
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
      const hostname = 'https://localjson.com';
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
