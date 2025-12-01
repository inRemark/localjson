# SSG 实施进度报告

## ✅ 已完成的工作

### 1. 依赖安装
- ✅ 安装 `vite-ssg@^28.2.2`
- ✅ 安装 `vite-plugin-sitemap@^0.8.2`
- ✅ 安装 `happy-dom@^20.0.11`（备用）

### 2. 入口文件改造
- ✅ 文件：`packages/web/src/main.ts`
- ✅ 从 CSR `createApp` 改为 ViteSSG 工厂函数
- ✅ 移除 `createRouter` + `createWebHistory`（由 ViteSSG 自动处理）
- ✅ 将 `registerSW()` 移至 `if (isClient)` 块内
- ✅ 保留所有插件配置（Pinia、@vueuse/head、i18n、Naive UI、plausible）

### 3. 构建脚本更新
- ✅ 文件：`packages/web/package.json`
- ✅ 主构建命令改为 `vite-ssg build`
- ✅ 保留原构建命令为 `build:legacy`
- ✅ 新增 `preview:ssg` 脚本用于预览静态构建产物

### 4. Vite 配置
- ✅ 文件：`packages/web/vite.config.ts`
- ✅ 导入 `vite-plugin-sitemap` 和类型 `ViteSSGOptions`
- ✅ 配置 Sitemap 插件（hostname: https://localjson.com）
- ✅ 添加 `ssgOptions` 配置块
- ✅ 实现 `onPageRendered` 钩子注入 Google Analytics

### 5. 环境变量配置
- ✅ 文件：`.env.production`
- ✅ 配置 `VITE_GA_MEASUREMENT_ID=G-PXPC8P2K6C`
- ✅ 配置 `BASE_URL=/`

### 6. 移除硬编码 GA 脚本
- ✅ 文件：`packages/web/index.html`（第 48-56 行已删除）
- ✅ 文件：`packages/web/index_cn.html`（第 48-56 行已删除）

### 7. TypeScript 类型声明
- ✅ 文件：`packages/web/env.d.ts`
- ✅ 添加 `Window.gtag` 类型声明
- ✅ 添加 `Window.dataLayer` 类型声明
- ✅ 添加 `ImportMetaEnv.VITE_GA_MEASUREMENT_ID` 类型声明
- ✅ 添加 `vite-ssg/client` 类型引用

---

## ✅ 当前状态与决策

### DOM / jsdom 相关问题
- 之前构建时遇到 `jsdom@27` 与 `parse5@8` 的 ESM/CommonJS 冲突：
  - `Error [ERR_REQUIRE_ESM]: require() of ES Module parse5/dist/index.js not supported`
- 最终决策：**不再强依赖 jsdom / happy-dom，通过 vite-ssg 的 `mock: true` 配合路由过滤来稳定构建**
  - 在 `vite.config.ts` 的 `ssgOptions` 中开启 `mock: true`
  - 通过 `includedRoutes` 过滤掉已知有 SSR 问题的工具页面（例如 `/bip39-generator` 等）
  - 其余页面正常预渲，问题工具页继续走 CSR，不影响功能

### 构建与预渲状态
- ✅ `pnpm build` 可以在 `packages/web` 成功完成 SSG 构建
- ✅ 绝大多数组件页面会在构建阶段生成静态 HTML（mock 模式下已验证包含主要内容）
- ✅ GA 脚本会在 `onPageRendered` 钩子中注入到所有预渲页面
- ✅ 构建结束后会在 `onFinished` 钩子中基于 `dist/` 目录扫描所有 `index.html` 自动生成 `sitemap.xml`

### Service Worker 与静态文件访问
- ✅ 已配置 `navigateFallbackDenylist` 排除 `sitemap.xml`、`robots.txt` 等静态文件，避免被 Service Worker 拦截
- ⚠️ **注意**：如果浏览器中已注册旧的 Service Worker，可能需要清除缓存或使用无痕模式测试
- ✅ 验证：在无痕模式下访问 `http://localhost:5050/sitemap.xml` 可正常显示 XML 内容

---

## 📋 验证任务（已执行 & 建议保留的回归步骤）

1. ✅ 在 `packages/web` 下执行构建：`pnpm build`
2. ✅ 验证 `dist` 目录生成的静态 HTML 文件（随机打开首页和若干工具页，查看“页面源代码”）
3. ✅ 检查 HTML 中是否包含注入的 GA 脚本
4. ✅ 检查 `dist/sitemap.xml` 是否生成且包含主要路由（已排除无效路由如 `:pathMatch(.*)*`）
5. ✅ 本地预览：`pnpm preview:ssg` 并访问 `http://localhost:5050`
6. ✅ 验证 `sitemap.xml` 可访问：在无痕模式下访问 `http://localhost:5050/sitemap.xml` 应正常显示
7. ✅ 验证客户端水合后交互功能正常（工具输入、计算、上传等）

---

## 🎯 下一步建议

### 立即执行（等待依赖安装完成后）
```bash
cd /Users/remark/gitHub/myPro/localjson_project/localjson/packages/web
pnpm build
```

### 验证构建产物
```bash
# 检查生成的文件
ls -la dist/
cat dist/index.html | grep "gtag"

# 本地预览
pnpm preview:ssg
# 访问 http://localhost:5050
```

### 验证 SEO 效果
1. 查看源代码（Ctrl+U）确认 GA 脚本已注入
2. 检查 `dist/sitemap.xml` 是否生成
3. 使用 Lighthouse 审计 SEO 分数
4. 部署到测试环境验证爬虫可抓取性

---

## 📝 实施清单

- [x] 安装 SSG 相关依赖
- [x] 改造 main.ts 为 ViteSSG 工厂函数
- [x] 更新 package.json 构建脚本
- [x] 配置 vite.config.ts (sitemap + GA)
- [x] 创建 .env.production 环境变量
- [x] 移除 index.html 和 index_cn.html 的硬编码 GA
- [x] 添加 TypeScript 类型声明
- [x] 通过 `mock: true` + 路由过滤规避 jsdom 依赖冲突
- [x] 成功执行 SSG 构建
- [x] 验证 GA 脚本注入
- [x] 验证 sitemap 生成（已排除无效路由）
- [x] 配置 Service Worker 排除静态文件（navigateFallbackDenylist）
- [x] 验证 sitemap.xml 可访问（无痕模式测试通过）
- [x] 本地预览测试
- [ ] Desktop 版本兼容性测试（建议在大版本发布前做一次完整回归）

---

## 🔧 需要用户决定

1. **是否在未来替换 mock 模式为真实 DOM 环境（如 happy-dom）？**
   - 当前方案已稳定可用，除非有「必须依赖真实 SSR 行为」的需求，否则可以继续沿用

2. **是否需要针对 sitemap 做更细粒度的控制（如多语言、优先级、changefreq 差异化）？**
   - 目前 sitemap 是基于 `dist/` 中所有 `index.html` 自动生成，已满足基础 SEO 需求

3. **Google AdSense 脚本是否也需要环境变量化**？
   - 当前仍硬编码在 index.html 中（第 58-59 行）

---

## 提交信息建议

```bash
feat(web): implement SSG with vite-ssg and GA injection

- Refactor main.ts to ViteSSG factory function
- Add sitemap generation with vite-plugin-sitemap
- Inject Google Analytics via onPageRendered hook
- Remove hardcoded GA scripts from index.html
- Add environment variable configuration
- Add TypeScript types for GA and env vars
- Update build scripts for SSG workflow
```
