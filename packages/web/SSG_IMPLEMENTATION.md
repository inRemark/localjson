# Web 端 SSG (静态站点生成) 改造方案

## 一、方案概述

### 选型：vite-ssg
- **技术栈兼容**：与现有 Vue3 + Vite 架构无缝集成
- **改造成本低**：复用现有路由、插件、组件
- **SEO 提升**：预渲染所有页面为静态 HTML，搜索引擎直接抓取完整内容
- **部署灵活**：输出纯静态资源，可部署到任何 CDN/静态服务器
- **交互保留**：水合后所有工具的输入、计算、上传功能完全正常

### 对 Desktop 版本的影响
**零影响**：
- SSG 改造仅在 `packages/web` 子包内进行
- Desktop 子包继续使用 hash 路由与静态构建
- 共享的 `core` 组件需保证"SSR 安全"（避免模块顶层访问 window/document）

---

## 二、实施步骤

### 步骤 1：安装依赖
```bash
# 在项目根目录执行
pnpm add -D vite-ssg vite-plugin-sitemap
```

### 步骤 2：改造入口文件
**文件**：`packages/web/src/main.ts`

**改造前**（当前 CSR 入口）：
```typescript
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
// ... 其他导入

const app = createApp(App);
// ... 配置插件
const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes,
});
app.use(router);
app.mount('#app');
```

**改造后**（SSG 工厂函数）：
```typescript
import { ViteSSG } from 'vite-ssg';
import { routes } from './router';
import App from '@/core/App.vue';
import { setPlatformAdapter } from '@/core/adapters';
import { webAdapter } from '@/core/adapters/web';
import { config } from '@/core/config';

// ... 其他导入保持不变

export const createApp = ViteSSG(
  App,
  { 
    routes,
    base: config.app.baseUrl,
  },
  ({ app, router, routes, isClient, initialState }) => {
    // 初始化平台适配器
    setPlatformAdapter(webAdapter);

    // 配置插件（SSR/CSR 都需要）
    app.use(createPinia());
    app.use(createHead());
    app.use(i18nPlugin);
    app.use(naive);
    app.use(plausible);

    // 仅客户端执行
    if (isClient) {
      // 注册 PWA Service Worker
      registerSW();
      
      if (import.meta.env.DEV) {
        console.log('[Web] Application started');
        console.log('[Web] Platform adapter:', webAdapter.type);
      }
    }
  }
);
```

### 步骤 3：更新构建脚本
**文件**：`packages/web/package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite-ssg build",
    "build:legacy": "vue-tsc --noEmit && cross-env NODE_OPTIONS=--max_old_space_size=4096 vite build",
    "preview": "vite preview --port 5050",
    "preview:ssg": "npx serve dist -p 5050"
  }
}
```

### 步骤 4：配置 Vite SSG 与 Google Analytics
**文件**：`packages/web/vite.config.ts`

当前已生效的核心配置（简化版）：

```ts
// ssgOptions 关键配置
const SSG_EXCLUDED_ROUTE_SUBSTRINGS = [
  '/bip39-generator',
  '/ascii-text-drawer',
  '/device-information',
  '/sql-prettify',
  '/text-diff',
] as const;

export default defineConfig({
  // ... 其他 Vite 配置（插件、PWA、自动导入等）

  ssr: {
    noExternal: ['naive-ui', '@vueuse/core', '@vueuse/head', 'vue-i18n'],
  },

  ssgOptions: {
    formatting: 'minify',
    dirStyle: 'nested',
    mock: true,
    // 过滤掉目前已知存在 SSR 问题的工具路由，这些页面改为纯 CSR
    includedRoutes(paths) {
      return paths.filter(path => !SSG_EXCLUDED_ROUTE_SUBSTRINGS.some(excluded => path.includes(excluded)));
    },
    // 注入 Google Analytics 到所有预渲染页面
    onPageRendered: (_route, html) => {
      const gaId = process.env.VITE_GA_MEASUREMENT_ID || 'G-PXPC8P2K6C';

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
    // 在所有页面预渲结束后，基于 dist 产物自动生成 sitemap.xml
    async onFinished() {
      const hostname = 'https://localjson.com';
      const fs = await import('node:fs');
      const path = await import('node:path');

      const distDir = path.resolve(__dirname, 'dist');
      const routes: string[] = [];

      function findHtmlFiles(dir: string, baseDir: string = dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            findHtmlFiles(filePath, baseDir);
          } else if (file === 'index.html') {
            let urlPath = path.relative(baseDir, dir);
            urlPath = urlPath ? `/${urlPath}` : '/';
            urlPath = urlPath.replace(/\\/g, '/');
            routes.push(urlPath);
          }
        }
      }

      findHtmlFiles(distDir);

      const now = new Date().toISOString();
      const urlEntries = routes
        .filter(route => !route.includes('/404'))
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

      const sitemapPath = path.join(distDir, 'sitemap.xml');
      fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    },
  } as ViteSSGOptions,
});
```

**环境变量配置**（可选）：
在项目根目录创建 `.env.production`：
```bash
# Google Analytics Measurement ID
VITE_GA_MEASUREMENT_ID=G-PXPC8P2K6C

# 或从现有 index.html 中迁移其他环境变量
```

### 步骤 5：SEO 增强
在每个页面组件中使用 `@vueuse/head`：

**示例**：`packages/core/src/pages/Home.page.vue`
```vue
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: () => t('app.title'),
  meta: [
    { name: 'description', content: () => t('app.description') },
    { property: 'og:title', content: () => t('app.title') },
    { property: 'og:description', content: () => t('app.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://yourdomain.com/' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => t('app.title') },
  ],
  link: [
    { rel: 'canonical', href: 'https://yourdomain.com/' },
  ],
});
</script>
```

**工具页示例**：为每个工具添加结构化数据
```vue
<script setup lang="ts">
useHead({
  title: 'JSON Formatter - LocalJson',
  meta: [
    { name: 'description', content: 'Format and validate JSON online' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'JSON Formatter',
        applicationCategory: 'DeveloperApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
        },
      }),
    },
  ],
});
</script>
```

### 步骤 6：处理重定向与 Canonical
**文件**：`packages/web/src/router.ts`

为旧路径添加重定向处理：
```typescript
// 已有的重定向路由会自动生成对应 HTML
// 在目标页面添加 canonical 标签
useHead({
  link: [
    { rel: 'canonical', href: `https://yourdomain.com${route.path}` }
  ]
});
```

### 步骤 7：多语言支持（可选）
为多语言页面添加 `hreflang` 标签：
```typescript
useHead({
  link: [
    { rel: 'alternate', hreflang: 'en', href: 'https://yourdomain.com/en/' },
    { rel: 'alternate', hreflang: 'zh', href: 'https://yourdomain.com/zh/' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://yourdomain.com/' },
  ],
});
```

---

## 三、Core 组件 SSR 安全改造

### 问题：模块顶层访问浏览器 API
❌ **不安全示例**：
```typescript
// 组件模块顶层
const isDark = localStorage.getItem('theme') === 'dark';
const userAgent = window.navigator.userAgent;
```

✅ **安全改造**：
```typescript
// 使用生命周期钩子
import { ref, onMounted } from 'vue';

const isDark = ref(false);
const userAgent = ref('');

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark';
  userAgent.value = window.navigator.userAgent;
});
```

✅ **使用 VueUse 提供的 SSR 安全组合式 API**：
```typescript
import { useLocalStorage, useMediaQuery } from '@vueuse/core';

// VueUse 自动处理 SSR 兼容
const theme = useLocalStorage('theme', 'light');
const isDark = useMediaQuery('(prefers-color-scheme: dark)');
```

### 建议审查清单
需检查以下目录中的组件是否在模块顶层访问浏览器 API：
- `packages/core/src/components/`
- `packages/core/src/composable/`
- `packages/core/src/tools/`
- `packages/core/src/stores/`

---

## 四、构建与部署

### 本地构建
```bash
# 在项目根目录
cd packages/web
pnpm build

# 构建产物在 dist/ 目录
# 包含所有预渲染的 HTML + 静态资源
```

### 本地预览
```bash
pnpm preview:ssg
# 访问 http://localhost:5050
```

### 部署到 Vercel（推荐）
**文件**：`packages/web/vercel.json`（已存在）
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 部署到 Nginx
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/localjson/dist;
  index index.html;

  location / {
    try_files $uri $uri/ $uri.html /index.html;
  }

  # Gzip 压缩
  gzip on;
  gzip_types text/html text/css application/javascript application/json;
  
  # 缓存静态资源
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 五、验证 SEO 效果

### 1. 查看源代码
访问任意页面 → 右键"查看网页源代码" → 确认 HTML 中包含完整的：
- `<title>`、`<meta description>`
- Open Graph 标签（`og:title`, `og:description`）
- 结构化数据（`<script type="application/ld+json">`）

### 2. Google Search Console
- 提交 sitemap.xml：`https://yourdomain.com/sitemap.xml`
- 使用"网址检查"工具验证页面可抓取性
- 查看"核心网页指标"与"页面体验"报告

### 3. 富结果测试
- 使用 [Google 富结果测试工具](https://search.google.com/test/rich-results)
- 验证结构化数据是否正确

### 4. Lighthouse SEO 审计
```bash
npx lighthouse https://yourdomain.com --only-categories=seo --view
```

---

# 六、Google Analytics 配置详解

### 当前状态
- 之前项目在 `packages/web/index.html` 和 `index_cn.html` 中硬编码了 GA ID：**G-PXPC8P2K6C**
- 现在已改为 **通过 `onPageRendered` 钩子统一注入**，HTML 模板中不再直接写 GA

### 选定方案：通过 `onPageRendered` 钩子统一注入 ✅（已实现）

**优点**：
- ✅ 集中管理：所有 GA 配置在 `vite.config.ts` 中统一维护
- ✅ 环境变量支持：可为不同环境（开发/生产/预览）配置不同 GA ID
- ✅ 自动化：SSG 构建时自动注入所有预渲染页面
- ✅ 无需修改 HTML 模板：移除 `index.html` 中的硬编码脚本

**实施步骤**：已在"步骤 4"中详细说明，核心代码如下：

```typescript
// vite.config.ts
ssgOptions: {
  onPageRendered: (route, html) => {
    const gaId = process.env.VITE_GA_MEASUREMENT_ID || 'G-PXPC8P2K6C';
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
</head>`
    );
  },
}
```

**配套改动**：
1. 从 `packages/web/index.html` 和 `index_cn.html` 中移除现有的 GA 脚本（第 48-56 行）
2. 在 `.env.production` 中配置 `VITE_GA_MEASUREMENT_ID=G-PXPC8P2K6C`
3. （可选）在 `.env.development` 中配置开发环境专用的 GA ID 或留空禁用追踪

### 环境变量配置

**文件**：项目根目录创建 `.env.production`
```bash
# Google Analytics Measurement ID
VITE_GA_MEASUREMENT_ID=G-PXPC8P2K6C

# 其他生产环境变量...
```

**文件**：项目根目录创建 `.env.development`（可选）
```bash
# 开发环境禁用 GA 或使用测试 ID
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 清理现有硬编码（重要）

需从以下文件移除 GA 脚本（第 48-56 行）：
- `packages/web/index.html`
- `packages/web/index_cn.html`

删除以下内容：
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-PXPC8P2K6C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-PXPC8P2K6C');
</script>
```

### Google Analytics 4 事件追踪增强

SSG 部署后，可在关键用户交互点添加自定义事件：

```typescript
// 工具使用追踪示例
function trackToolUsage(toolName: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tool_used', {
      tool_name: toolName,
      page_path: window.location.pathname,
    });
  }
}

// 在工具组件中调用
onMounted(() => {
  trackToolUsage('json-formatter');
});
```

**推荐追踪事件**：
- 工具使用：`tool_used`（工具名称、类别）
- 文件上传：`file_uploaded`（文件类型、大小）
- 复制操作：`content_copied`（工具名称、内容类型）
- 格式转换：`format_converted`（源格式、目标格式）
- 错误发生：`tool_error`（工具名称、错误类型）

### TypeScript 类型声明

**文件**：`packages/web/env.d.ts` 或 `packages/core/src/env.d.ts`

```typescript
// Google Analytics 全局类型声明
interface Window {
  gtag?: (
    command: 'event' | 'config' | 'set' | 'js',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];
}

// Vite 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  // ... 其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 七、常见问题

### Q1: 工具的交互功能（输入、计算、上传）会受影响吗？
**A**: 不会。SSG 只预渲染静态框架（页面结构、标题、描述），用户交互在客户端水合后完全正常执行。

### Q2: 如何处理需要"实时数据"的页面？
**A**: 保持现有设计，构建时只生成静态框架，数据在客户端通过 API 获取（CSR）。

### Q3: PWA 与 SSG 冲突吗？
**A**: 不冲突。vite-plugin-pwa 继续生成 Service Worker，离线缓存策略不变。

### Q4: 如何处理动态路由（如 `/tool/:id`）？
**A**: 在 `ssgOptions.includedRoutes` 中显式列出所有需要预渲染的路径，或通过 `onBeforePageRender` 动态生成。

### Q5: Desktop 版本需要改造吗？
**A**: 不需要。只要 `core` 组件保持 SSR 安全，Desktop 继续使用原有构建流程。

---

## 八、后续优化方向

### 短期（完成 SSG 后）
- [ ] 为所有工具页添加结构化数据（JSON-LD）
- [ ] 生成多语言 sitemap
- [ ] ✅ 配置 Google Analytics 4 基础追踪（已选定方案 1）
- [ ] 从 `index.html` 和 `index_cn.html` 移除硬编码的 GA 脚本
- [ ] 创建 `.env.production` 配置 GA ID
- [ ] 添加 GA4 自定义事件（工具使用、文件上传、复制操作等）
- [ ] 优化图片（WebP 格式、懒加载）
- [ ] 从 `index.html` 迁移 Google AdSense 配置到环境变量

### 中期（按需）
- [ ] 引入 ISR（增量静态再生）- 需迁移到 Nuxt 或自建 SSR
- [ ] 为"可分享的结果页"添加 SSR（动态 meta 标签）
- [ ] A/B 测试不同 meta description 的点击率
- [ ] 配置 GA4 增强型电子商务事件（如有需要）
- [ ] 整合 Google Tag Manager（统一管理 GA、AdSense、第三方脚本）

### 长期（可选）
- [ ] 迁移到 Nuxt 3（获得完整 SSR/ISR/Edge 生态）
- [ ] 引入 Edge Functions 实现个性化 SEO

---

## 九、技术支持

### 相关文档
- [vite-ssg 官方文档](https://github.com/antfu/vite-ssg)
- [@vueuse/head 文档](https://github.com/vueuse/head)
- [Google 搜索中心 - 结构化数据](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

### 项目内相关文件
- 路由定义：`packages/web/src/router.ts`
- 工具列表：`packages/core/src/tools/index.ts`
- 平台适配器：`packages/core/src/adapters/`
- 构建配置：`packages/web/vite.config.ts`

---

## 变更记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2025-11-29 | v1.0 | 初始方案文档 |

---

**提交信息**：
```
feat(web): add SSG implementation plan document
```
