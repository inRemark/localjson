# LocalJson Monorepo 迁移指南

## 📋 目录

- [概述](#概述)
- [架构设计](#架构设计)
- [实施步骤](#实施步骤)
- [代码示例](#代码示例)
- [迁移检查清单](#迁移检查清单)
- [常见问题](#常见问题)

---

## 概述

### 当前问题

- **代码重复率 95%+**：`frontend/` 和 `web/` 目录包含几乎相同的代码
- **维护成本高**：每个 bug 修复、新功能需要在两处同步
- **一致性风险**：依赖版本、逻辑实现可能产生差异
- **扩展困难**：未来添加新平台（如移动端）将加剧问题

### 目标架构

采用 **Monorepo + 平台适配器模式**，实现：

- ✅ 核心代码单一维护（DRY 原则）
- ✅ 平台差异通过适配器抽象
- ✅ 类型安全的跨平台调用
- ✅ 独立构建和优化
- ✅ 易于扩展新平台

---

## 架构设计

### 最终目录结构

```bash
localjson/
├── packages/
│   ├── core/                      # 共享核心库（90%+ 代码）
│   │   ├── src/
│   │   │   ├── adapters/          # 🔑 平台适配层
│   │   │   │   ├── index.ts       # 适配器接口定义
│   │   │   │   ├── types.ts       # TypeScript 类型
│   │   │   │   ├── web.ts         # Web 平台实现
│   │   │   │   └── desktop.ts     # Desktop 平台实现
│   │   │   ├── components/        # 通用 UI 组件
│   │   │   ├── composable/        # Vue Composables
│   │   │   ├── tools/             # 所有工具集合
│   │   │   ├── stores/            # 状态管理
│   │   │   ├── utils/             # 工具函数
│   │   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── layouts/           # 布局组件
│   │   │   ├── pages/             # 页面组件
│   │   │   ├── assets/            # 静态资源
│   │   │   ├── themes.ts          # 主题配置
│   │   │   ├── config.ts          # 配置文件
│   │   │   └── App.vue            # 根组件
│   │   ├── locales/               # 国际化文件
│   │   ├── public/                # 公共资源
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts         # 用于开发测试
│   │
│   ├── desktop/                   # Desktop 应用入口（薄层）
│   │   ├── src/
│   │   │   ├── main.ts            # 入口文件（注入 desktop adapter）
│   │   │   ├── router.ts          # Desktop 特定路由配置
│   │   │   └── pages/             # Desktop 独有页面（如有）
│   │   ├── wailsjs/               # Wails 自动生成绑定
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── web/                       # Web 应用入口（薄层）
│       ├── src/
│       │   ├── main.ts            # 入口文件（注入 web adapter）
│       │   ├── router.ts          # Web 特定路由配置
│       │   └── pages/             # Web 独有页面（如 Terms.vue）
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── app/                           # Go 后端代码（保持不变）
├── build/                         # 构建输出
├── pnpm-workspace.yaml            # 🆕 Workspace 配置
├── package.json                   # 根 package.json
├── wails.json                     # 更新路径指向 packages/desktop
└── README.md
```

### 平台适配器架构

```bash
┌─────────────────────────────────────────┐
│           UI Components                 │
│  (c-link, c-button, file-upload, etc.)  │
└─────────────┬───────────────────────────┘
              │
              │ usePlatform()
              ▼
┌─────────────────────────────────────────┐
│      Platform Adapter Interface         │
│  (openURL, saveFile, copyToClipboard)   │
└─────────────┬───────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
      ▼                ▼
┌──────────┐    ┌──────────────┐
│   Web    │    │   Desktop    │
│ Adapter  │    │   Adapter    │
│          │    │              │
│ window   │    │  Wails API   │
│  .open() │    │ BrowserOpen  │
└──────────┘    │     URL()    │
                └──────────────┘
```

---

## 实施步骤

### 阶段 0：准备工作（0.5 天）

#### 1. 备份当前代码

```bash
# 创建备份分支
git checkout -b backup/before-monorepo
git push origin backup/before-monorepo

# 创建迁移分支
git checkout -b refactor/monorepo-migration
```

#### 2. 安装依赖管理工具

确保使用 pnpm（项目已在使用）：

```bash
# 检查 pnpm 版本
pnpm --version  # 建议 >= 8.0

# 如需升级
npm install -g pnpm@latest
```

---

### 阶段 1：创建 Monorepo 结构（0.5 天）

#### 1. 创建 Workspace 配置

```bash
# 在项目根目录创建 pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
EOF
```

#### 2. 创建目录结构

```bash
# 创建 packages 目录结构
mkdir -p packages/{core,desktop,web}

# 创建核心库目录
mkdir -p packages/core/{src,public,locales}
mkdir -p packages/core/src/{adapters,components,composable,tools,stores,utils,ui,layouts,pages,assets,modules,plugins}
```

#### 3. 更新根 package.json

```json
{
  "name": "localjson-monorepo",
  "version": "3.0.1",
  "private": true,
  "scripts": {
    "dev:desktop": "pnpm --filter @localjson/desktop dev",
    "dev:web": "pnpm --filter @localjson/web dev",
    "build:desktop": "pnpm --filter @localjson/desktop build",
    "build:web": "pnpm --filter @localjson/web build",
    "wails:dev": "wails dev",
    "wails:build": "wails build",
    "lint": "pnpm -r lint",
    "type-check": "pnpm -r type-check"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  },
  "dependencies": {
    "figue": "^3.1.1",
    "zod": "^4.1.12"
  }
}
```

---

### 阶段 2：创建平台适配器（1 天）

#### 1. 创建适配器类型定义

**文件：`packages/core/src/adapters/types.ts`**

```typescript
/**
 * 平台适配器接口
 * 定义所有平台需要实现的功能
 */
export interface PlatformAdapter {
  /**
   * 平台类型
   */
  readonly type: 'web' | 'desktop';

  /**
   * 在外部浏览器中打开 URL
   * @param url - 要打开的 URL
   */
  openURL(url: string): void;

  /**
   * 保存文件到本地
   * @param filename - 文件名
   * @param content - 文件内容（Base64 或文本）
   * @param mimeType - MIME 类型
   */
  saveFile(filename: string, content: string, mimeType?: string): Promise<void>;

  /**
   * 打开文件选择对话框
   * @param options - 文件选择选项
   * @returns 选中的文件
   */
  openFileDialog(options?: FileDialogOptions): Promise<File | File[] | null>;

  /**
   * 复制文本到剪贴板
   * @param text - 要复制的文本
   */
  copyToClipboard(text: string): Promise<void>;

  /**
   * 获取平台信息
   */
  getPlatformInfo(): PlatformInfo;

  /**
   * 显示通知
   * @param title - 通知标题
   * @param message - 通知内容
   */
  showNotification?(title: string, message: string): void;

  /**
   * 检查功能是否支持
   */
  isSupported(feature: PlatformFeature): boolean;
}

export interface FileDialogOptions {
  accept?: string;
  multiple?: boolean;
}

export interface PlatformInfo {
  type: 'web' | 'desktop';
  os?: 'windows' | 'macos' | 'linux';
  version?: string;
}

export type PlatformFeature = 
  | 'file-system-access'
  | 'native-notifications'
  | 'clipboard';
```

#### 2. 创建 Web 平台适配器

**文件：`packages/core/src/adapters/web.ts`**

```typescript
import type { PlatformAdapter, FileDialogOptions, PlatformInfo, PlatformFeature } from './types';

export class WebPlatformAdapter implements PlatformAdapter {
  readonly type = 'web' as const;

  openURL(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async saveFile(filename: string, content: string, mimeType?: string): Promise<void> {
    // 创建下载链接
    const link = document.createElement('a');
    
    // 判断是否为 Base64 数据
    if (content.startsWith('data:')) {
      link.href = content;
    } else {
      const blob = new Blob([content], { type: mimeType || 'application/octet-stream' });
      link.href = URL.createObjectURL(blob);
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 清理 Object URL
    if (link.href.startsWith('blob:')) {
      URL.revokeObjectURL(link.href);
    }
  }

  async openFileDialog(options?: FileDialogOptions): Promise<File | File[] | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      
      if (options?.accept) {
        input.accept = options.accept;
      }
      
      if (options?.multiple) {
        input.multiple = true;
      }
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          resolve(null);
          return;
        }
        
        resolve(options?.multiple ? Array.from(files) : files[0]);
      };
      
      input.oncancel = () => {
        resolve(null);
      };
      
      input.click();
    });
  }

  async copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  getPlatformInfo(): PlatformInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    let os: PlatformInfo['os'] | undefined;
    
    if (userAgent.includes('win')) {
      os = 'windows';
    } else if (userAgent.includes('mac')) {
      os = 'macos';
    } else if (userAgent.includes('linux')) {
      os = 'linux';
    }
    
    return {
      type: 'web',
      os,
      version: navigator.userAgent,
    };
  }

  showNotification(title: string, message: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }

  isSupported(feature: PlatformFeature): boolean {
    switch (feature) {
      case 'file-system-access':
        return 'showOpenFilePicker' in window;
      case 'native-notifications':
        return 'Notification' in window;
      case 'clipboard':
        return !!navigator.clipboard;
      default:
        return false;
    }
  }
}

// 导出单例实例
export const webAdapter = new WebPlatformAdapter();
```

#### 3. 创建 Desktop 平台适配器

**文件：`packages/core/src/adapters/desktop.ts`**

```typescript
import type { PlatformAdapter, FileDialogOptions, PlatformInfo, PlatformFeature } from './types';

// 注意：这些导入在 packages/desktop 中会被正确解析
// 在 core 包中编译时会有警告，但不影响使用
let BrowserOpenURL: ((url: string) => void) | undefined;
let SaveBase64File: ((filename: string, data: string) => Promise<void>) | undefined;
let Environment: (() => Promise<any>) | undefined;

// 动态导入 Wails 函数（仅在 desktop 环境中可用）
if (typeof window !== 'undefined' && (window as any).wails) {
  try {
    const runtime = require('@wailsjs/runtime/runtime');
    const fileService = require('@wailsjs/go/services/fileService');
    
    BrowserOpenURL = runtime.BrowserOpenURL;
    SaveBase64File = fileService.SaveBase64File;
    Environment = runtime.Environment;
  } catch (e) {
    console.warn('Wails runtime not available:', e);
  }
}

export class DesktopPlatformAdapter implements PlatformAdapter {
  readonly type = 'desktop' as const;

  openURL(url: string): void {
    if (BrowserOpenURL) {
      BrowserOpenURL(url);
    } else {
      console.error('BrowserOpenURL not available');
    }
  }

  async saveFile(filename: string, content: string, mimeType?: string): Promise<void> {
    if (SaveBase64File) {
      // 如果内容不是 Base64，需要转换
      let base64Content = content;
      if (!content.startsWith('data:')) {
        const blob = new Blob([content], { type: mimeType });
        base64Content = await this.blobToBase64(blob);
      }
      
      await SaveBase64File(filename, base64Content);
    } else {
      console.error('SaveBase64File not available');
      throw new Error('File save not supported');
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async openFileDialog(options?: FileDialogOptions): Promise<File | File[] | null> {
    // Desktop 环境使用原生文件选择器
    // 这里使用 HTML input 作为 fallback
    // 实际项目中应该调用 Wails 的文件对话框 API
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      
      if (options?.accept) {
        input.accept = options.accept;
      }
      
      if (options?.multiple) {
        input.multiple = true;
      }
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          resolve(null);
          return;
        }
        
        resolve(options?.multiple ? Array.from(files) : files[0]);
      };
      
      input.click();
    });
  }

  async copyToClipboard(text: string): Promise<void> {
    // 使用浏览器 API 作为 fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('Clipboard not supported');
    }
  }

  getPlatformInfo(): PlatformInfo {
    // 在实际实现中，应该调用 Wails Environment API
    return {
      type: 'desktop',
      os: this.detectOS(),
      version: '3.0.1',
    };
  }

  private detectOS(): 'windows' | 'macos' | 'linux' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    return 'linux';
  }

  showNotification(title: string, message: string): void {
    // Desktop 应该使用系统原生通知
    // 这里使用浏览器通知作为 fallback
    if ('Notification' in window) {
      new Notification(title, { body: message });
    }
  }

  isSupported(feature: PlatformFeature): boolean {
    switch (feature) {
      case 'file-system-access':
        return true;
      case 'native-notifications':
        return true;
      case 'clipboard':
        return true;
      default:
        return false;
    }
  }
}

// 导出单例实例
export const desktopAdapter = new DesktopPlatformAdapter();
```

#### 4. 创建适配器管理器

**文件：`packages/core/src/adapters/index.ts`**

```typescript
import type { PlatformAdapter } from './types';
import { webAdapter } from './web';
import { desktopAdapter } from './desktop';

export * from './types';
export { webAdapter } from './web';
export { desktopAdapter } from './desktop';

/**
 * 当前激活的平台适配器
 */
let currentAdapter: PlatformAdapter | null = null;

/**
 * 设置平台适配器
 * 必须在应用启动时调用
 */
export function setPlatformAdapter(adapter: PlatformAdapter): void {
  currentAdapter = adapter;
  console.log(`[Platform] Adapter set to: ${adapter.type}`);
}

/**
 * 获取当前平台适配器
 * 如果未设置，抛出错误
 */
export function getPlatformAdapter(): PlatformAdapter {
  if (!currentAdapter) {
    throw new Error(
      'Platform adapter not initialized. Call setPlatformAdapter() in your main.ts'
    );
  }
  return currentAdapter;
}

/**
 * Vue Composable: 使用平台适配器
 */
export function usePlatform(): PlatformAdapter {
  return getPlatformAdapter();
}

/**
 * 检查是否为 Web 平台
 */
export function isWebPlatform(): boolean {
  return currentAdapter?.type === 'web';
}

/**
 * 检查是否为 Desktop 平台
 */
export function isDesktopPlatform(): boolean {
  return currentAdapter?.type === 'desktop';
}

/**
 * 自动检测并设置适配器（仅用于开发测试）
 * 生产环境应该显式调用 setPlatformAdapter
 */
export function autoDetectPlatform(): void {
  if (typeof window !== 'undefined' && (window as any).wails) {
    setPlatformAdapter(desktopAdapter);
  } else {
    setPlatformAdapter(webAdapter);
  }
}
```

---

### 阶段 3：迁移核心代码（3-5 天）

#### 1. 迁移通用代码

```bash
# 从 frontend 复制核心代码到 packages/core/src
# 排除平台特定的代码

# 复制组件
cp -r frontend/src/components packages/core/src/
cp -r frontend/src/composable packages/core/src/
cp -r frontend/src/tools packages/core/src/
cp -r frontend/src/stores packages/core/src/
cp -r frontend/src/utils packages/core/src/
cp -r frontend/src/ui packages/core/src/
cp -r frontend/src/layouts packages/core/src/
cp -r frontend/src/modules packages/core/src/
cp -r frontend/src/plugins packages/core/src/
cp -r frontend/src/assets packages/core/src/

# 复制根文件
cp frontend/src/App.vue packages/core/src/
cp frontend/src/config.ts packages/core/src/
cp frontend/src/themes.ts packages/core/src/
cp frontend/src/shims.d.ts packages/core/src/

# 复制国际化文件
cp -r frontend/locales packages/core/

# 复制公共资源
cp -r frontend/public packages/core/
```

#### 2. 创建核心库 package.json

**文件：`packages/core/package.json`**

```json
{
  "name": "@localjson/core",
  "version": "3.0.1",
  "type": "module",
  "description": "LocalJson core library - shared components and logic",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./adapters": {
      "types": "./src/adapters/index.ts",
      "default": "./src/adapters/index.ts"
    },
    "./components/*": "./src/components/*",
    "./composable/*": "./src/composable/*",
    "./tools/*": "./src/tools/*",
    "./stores/*": "./src/stores/*",
    "./utils/*": "./src/utils/*",
    "./ui/*": "./src/ui/*",
    "./App.vue": "./src/App.vue",
    "./config": "./src/config.ts",
    "./themes": "./src/themes.ts"
  },
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "@intlify/unplugin-vue-i18n": "^2.0.0",
    "@nanostores/vue": "^0.10.0",
    "@types/lodash": "^4.17.12",
    "@vueuse/core": "^11.2.0",
    "figue": "^3.1.1",
    "lodash": "^4.17.21",
    "naive-ui": "^2.40.1",
    "pinia": "^2.2.8",
    "vue": "^3.5.13",
    "vue-i18n": "^10.0.5",
    "vue-router": "^4.4.5",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "@vitejs/plugin-vue-jsx": "^4.1.1",
    "typescript": "^5.7.2",
    "vite": "^6.4.1",
    "vue-tsc": "^2.1.10"
  }
}
```

#### 3. 重构组件以使用适配器

**示例：更新 `packages/core/src/ui/c-link/c-link.vue`**

```vue
<script lang="ts" setup>
import { type RouteLocationRaw, RouterLink } from 'vue-router';
import { useTheme } from './c-link.theme';
import { usePlatform } from '@/adapters';

const props = withDefaults(defineProps<{
  href?: string
  to?: RouteLocationRaw
  openUrl?: string
}>(), {
  href: undefined,
  to: undefined,
  openUrl: '',
});

const { href, to, openUrl } = toRefs(props);
const platform = usePlatform();

function handleClick(event: MouseEvent) {
  if (openUrl.value.length > 0) {
    event.preventDefault();
    platform.openURL(openUrl.value);
  }
}

const theme = useTheme();
const tag = computed(() => {
  if (href?.value) {
    return 'a';
  }
  if (to?.value) {
    return RouterLink;
  }
  return 'span';
});
</script>

<template>
  <component 
    :is="tag" 
    :href="href ?? to" 
    class="c-link" 
    :to="to"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style lang="less" scoped>
.c-link {
  color: v-bind('theme.color');
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: v-bind('theme.hoverColor');
    text-decoration: underline;
  }
}
</style>
```

**示例：更新 `packages/core/src/stores/fileUtils.ts`**

```typescript
import { defineStore } from 'pinia';
import { usePlatform } from '@/adapters';

export const useFileStore = defineStore('file', () => {
  const platform = usePlatform();

  async function saveBase64File(filename: string, base64Data: string) {
    try {
      await platform.saveFile(filename, base64Data);
      return { success: true };
    } catch (error) {
      console.error('Failed to save file:', error);
      return { success: false, error };
    }
  }

  async function selectFile(options?: { accept?: string; multiple?: boolean }) {
    try {
      const file = await platform.openFileDialog(options);
      return file;
    } catch (error) {
      console.error('Failed to open file dialog:', error);
      return null;
    }
  }

  return {
    saveBase64File,
    selectFile,
  };
});
```

#### 4. 更新所有引用 Wails API 的文件

搜索并替换所有 Wails 导入：

```bash
# 在 packages/core/src 中查找所有 Wails 引用
cd packages/core/src
grep -r "@wailsjs" . --include="*.vue" --include="*.ts"
grep -r "wailsjs/runtime" . --include="*.vue" --include="*.ts"
grep -r "BrowserOpenURL" . --include="*.vue" --include="*.ts"
grep -r "SaveBase64File" . --include="*.vue" --include="*.ts"
```

将找到的文件逐一更新为使用 `usePlatform()`。

#### 5. 创建核心库导出文件

**文件：`packages/core/src/index.ts`**

```typescript
// 导出适配器
export * from './adapters';

// 导出配置
export { default as App } from './App.vue';
export * from './config';
export * from './themes';

// 导出常用工具
export * from './utils';

// 导出 composables
export * from './composable';

// 导出 stores
export * from './stores';

// 如果需要，可以导出特定组件
// export { default as CButton } from './ui/c-button/c-button.vue';
```

---

### 阶段 4：配置 Desktop 应用（1 天）

#### 1. 移动并清理 Desktop 代码

```bash
# 移动 frontend 到 packages/desktop
mv frontend packages/desktop

# 删除已迁移到 core 的代码
cd packages/desktop/src
rm -rf components composable tools stores utils ui layouts modules plugins assets
rm App.vue config.ts themes.ts
```

#### 2. 创建 Desktop package.json

**文件：`packages/desktop/package.json`**

```json
{
  "name": "@localjson/desktop",
  "version": "3.0.1",
  "type": "module",
  "description": "LocalJson desktop application (Wails)",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && cross-env NODE_OPTIONS=--max_old_space_size=4096 vite build",
    "preview": "vite preview --port 5050"
  },
  "dependencies": {
    "@localjson/core": "workspace:*",
    "vue": "^3.5.13",
    "vue-router": "^4.4.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "@vitejs/plugin-vue-jsx": "^4.1.1",
    "cross-env": "^7.0.3",
    "typescript": "^5.7.2",
    "vite": "^6.4.1",
    "vue-tsc": "^2.1.10"
  }
}
```

#### 3. 创建 Desktop main.ts

**文件：`packages/desktop/src/main.ts`**

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';

// 导入核心应用
import App from '@localjson/core/App.vue';

// 导入并设置 Desktop 适配器
import { setPlatformAdapter, desktopAdapter } from '@localjson/core/adapters';

// 导入路由配置
import { routes } from './router';

// 导入样式（如果有 desktop 特定样式）
import './styles/desktop.css';

// 初始化平台适配器
setPlatformAdapter(desktopAdapter);

// 创建 Vue 应用
const app = createApp(App);

// 创建 Pinia store
const pinia = createPinia();
app.use(pinia);

// 创建路由（Desktop 使用 hash 模式）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
app.use(router);

// 挂载应用
app.mount('#app');

// 开发环境日志
if (import.meta.env.DEV) {
  console.log('[Desktop] Application started');
  console.log('[Desktop] Platform adapter:', desktopAdapter.type);
}
```

#### 4. 创建 Desktop 路由

**文件：`packages/desktop/src/router.ts`**

```typescript
import type { RouteRecordRaw } from 'vue-router';

// 从 core 导入页面组件
import Home from '@localjson/core/pages/Home.page.vue';
import Apps from '@localjson/core/pages/Apps.vue';
import Download from '@localjson/core/pages/Download.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/apps',
    name: 'apps',
    component: Apps,
  },
  {
    path: '/download',
    name: 'download',
    component: Download,
  },
  // 工具路由会在 core 中自动注册
  // 如果有 desktop 特定路由，在这里添加
];
```

#### 5. 更新 Desktop vite.config.ts

**文件：`packages/desktop/vite.config.ts`**

```typescript
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@localjson/core': path.resolve(__dirname, '../core/src'),
      '@wailsjs': path.resolve(__dirname, './wailsjs'),
    },
  },
  build: {
    target: 'esnext',
    outDir: '../../build/bin',
    emptyOutDir: false,
  },
});
```

#### 6. 更新 wails.json

**文件：根目录 `wails.json`**

```json
{
  "$schema": "https://wails.io/schemas/config.v2.json",
  "name": "LocalJson",
  "outputfilename": "LocalJson",
  "frontend:install": "cd packages/desktop && pnpm install",
  "frontend:build": "cd packages/desktop && pnpm run build",
  "frontend:dev:watcher": "cd packages/desktop && pnpm run dev",
  "frontend:dev:serverUrl": "auto",
  "author": {
    "name": "remark",
    "email": "inremark@outlook.com"
  }
}
```

---

### 阶段 5：配置 Web 应用（1 天）

#### 1. 移动并清理 Web 代码

```bash
# web 目录已存在，只需清理
cd packages/web/src
rm -rf components composable tools stores utils ui layouts modules plugins assets
rm App.vue config.ts themes.ts

# 保留 web 特有的页面（如 Terms.vue）
mkdir -p pages
# 如果有特定页面，移动到这里
```

#### 2. 创建 Web package.json

**文件：`packages/web/package.json`**

```json
{
  "name": "@localjson/web",
  "version": "3.0.1",
  "type": "module",
  "description": "LocalJson web application",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && cross-env NODE_OPTIONS=--max_old_space_size=4096 vite build",
    "preview": "vite preview --port 5050"
  },
  "dependencies": {
    "@localjson/core": "workspace:*",
    "vue": "^3.5.13",
    "vue-router": "^4.4.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "@vitejs/plugin-vue-jsx": "^4.1.1",
    "cross-env": "^7.0.3",
    "typescript": "^5.7.2",
    "vite": "^6.4.1",
    "vue-tsc": "^2.1.10"
  }
}
```

#### 3. 创建 Web main.ts

**文件：`packages/web/src/main.ts`**

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// 导入核心应用
import App from '@localjson/core/App.vue';

// 导入并设置 Web 适配器
import { setPlatformAdapter, webAdapter } from '@localjson/core/adapters';

// 导入路由配置
import { routes } from './router';

// 导入样式（如果有 web 特定样式）
import './styles/web.css';

// 初始化平台适配器
setPlatformAdapter(webAdapter);

// 创建 Vue 应用
const app = createApp(App);

// 创建 Pinia store
const pinia = createPinia();
app.use(pinia);

// 创建路由（Web 使用 history 模式）
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
app.use(router);

// 挂载应用
app.mount('#app');

// 开发环境日志
if (import.meta.env.DEV) {
  console.log('[Web] Application started');
  console.log('[Web] Platform adapter:', webAdapter.type);
}
```

#### 4. 创建 Web 路由

**文件：`packages/web/src/router.ts`**

```typescript
import type { RouteRecordRaw } from 'vue-router';

// 从 core 导入页面组件
import Home from '@localjson/core/pages/Home.page.vue';
import Apps from '@localjson/core/pages/Apps.vue';
import Download from '@localjson/core/pages/Download.vue';

// Web 特有页面
import Terms from './pages/Terms.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/apps',
    name: 'apps',
    component: Apps,
  },
  {
    path: '/download',
    name: 'download',
    component: Download,
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms,
  },
  // 工具路由会在 core 中自动注册
];
```

#### 5. 更新 Web vite.config.ts

**文件：`packages/web/vite.config.ts`**

```typescript
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { VitePWA } from 'vite-plugin-pwa';

const baseUrl = process.env.BASE_URL ?? '/';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'LocalJson',
        description: 'Aggregated set of useful tools for developers.',
        display: 'standalone',
        start_url: `${baseUrl}?utm_source=pwa&utm_medium=pwa`,
        theme_color: '#18a058',
        background_color: '#f1f5f9',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: baseUrl,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@localjson/core': path.resolve(__dirname, '../core/src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
```

---

### 阶段 6：安装依赖和测试（1 天）

#### 1. 安装所有依赖

```bash
# 在根目录执行
pnpm install

# 这会安装所有 workspace 包的依赖
```

#### 2. 测试 Web 应用

```bash
# 启动 Web 开发服务器
pnpm dev:web

# 在浏览器中打开 http://localhost:5173
# 测试所有功能是否正常
```

#### 3. 测试 Desktop 应用

```bash
# 启动 Desktop 开发
pnpm wails:dev

# 或者
cd packages/desktop
wails dev
```

#### 4. 类型检查

```bash
# 检查所有包的类型
pnpm type-check

# 单独检查某个包
pnpm --filter @localjson/core type-check
```

---

### 阶段 7：构建和优化（1 天）

#### 1. 测试构建

```bash
# 构建 Web
pnpm build:web

# 构建 Desktop
pnpm wails:build

# 或
pnpm build:desktop
wails build
```

#### 2. 代码清理

```bash
# 删除旧的目录（确认迁移成功后）
rm -rf frontend web

# 提交更改
git add .
git commit -m "refactor: migrate to monorepo architecture"
```

#### 3. 更新文档

更新 README.md，说明新的目录结构和开发流程。

---

## 代码示例

### 在组件中使用平台适配器

#### 示例 1：打开外部链接

```vue
<script setup lang="ts">
import { usePlatform } from '@localjson/core/adapters';

const platform = usePlatform();

function openGitHub() {
  platform.openURL('https://github.com/inRemark/localjson');
}
</script>

<template>
  <button @click="openGitHub">
    View on GitHub
  </button>
</template>
```

#### 示例 2：保存文件

```vue
<script setup lang="ts">
import { usePlatform } from '@localjson/core/adapters';

const platform = usePlatform();
const content = ref('Hello, World!');

async function handleSave() {
  try {
    await platform.saveFile('output.txt', content.value, 'text/plain');
    console.log('File saved successfully');
  } catch (error) {
    console.error('Failed to save file:', error);
  }
}
</script>

<template>
  <div>
    <textarea v-model="content" />
    <button @click="handleSave">Save File</button>
  </div>
</template>
```

#### 示例 3：选择文件

```vue
<script setup lang="ts">
import { usePlatform } from '@localjson/core/adapters';

const platform = usePlatform();
const selectedFile = ref<File | null>(null);

async function handleSelectFile() {
  const file = await platform.openFileDialog({
    accept: 'image/*',
    multiple: false,
  });
  
  if (file && !Array.isArray(file)) {
    selectedFile.value = file;
  }
}
</script>

<template>
  <div>
    <button @click="handleSelectFile">Select Image</button>
    <div v-if="selectedFile">
      Selected: {{ selectedFile.name }}
    </div>
  </div>
</template>
```

#### 示例 4：平台特定功能

```vue
<script setup lang="ts">
import { usePlatform, isDesktopPlatform } from '@localjson/core/adapters';

const platform = usePlatform();
const isDesktop = isDesktopPlatform();

// 检查功能支持
const supportsNativeNotifications = platform.isSupported('native-notifications');

async function showNotification() {
  if (supportsNativeNotifications) {
    platform.showNotification?.('Hello', 'This is a notification!');
  }
}
</script>

<template>
  <div>
    <p>Platform: {{ platform.type }}</p>
    <p>Desktop: {{ isDesktop ? 'Yes' : 'No' }}</p>
    <button 
      v-if="supportsNativeNotifications"
      @click="showNotification"
    >
      Show Notification
    </button>
  </div>
</template>
```

---

## 迁移检查清单

### 准备阶段

- [ ] 创建备份分支
- [ ] 创建迁移分支
- [ ] 确认 pnpm 版本 >= 8.0

### 结构搭建

- [ ] 创建 `pnpm-workspace.yaml`
- [ ] 创建 `packages/` 目录结构
- [ ] 创建根 `package.json`

### 适配器实现

- [ ] 创建 `adapters/types.ts`
- [ ] 实现 `adapters/web.ts`
- [ ] 实现 `adapters/desktop.ts`
- [ ] 创建 `adapters/index.ts`
- [ ] 测试适配器功能

### 核心库迁移

- [ ] 复制通用代码到 `packages/core/src`
- [ ] 创建 `packages/core/package.json`
- [ ] 更新所有 Wails 引用为适配器调用
- [ ] 更新导入路径
- [ ] 创建 `packages/core/src/index.ts`

### Desktop 应用配置

- [ ] 移动 `frontend` 到 `packages/desktop`
- [ ] 创建 `packages/desktop/package.json`
- [ ] 创建 `packages/desktop/src/main.ts`
- [ ] 创建 `packages/desktop/src/router.ts`
- [ ] 更新 `packages/desktop/vite.config.ts`
- [ ] 更新根目录 `wails.json`

### Web 应用配置

- [ ] 移动 `web` 到 `packages/web`
- [ ] 创建 `packages/web/package.json`
- [ ] 创建 `packages/web/src/main.ts`
- [ ] 创建 `packages/web/src/router.ts`
- [ ] 更新 `packages/web/vite.config.ts`
- [ ] 保留 Web 特有页面

### 测试验证

- [ ] 安装所有依赖 (`pnpm install`)
- [ ] Web 开发模式测试 (`pnpm dev:web`)
- [ ] Desktop 开发模式测试 (`pnpm wails:dev`)
- [ ] 类型检查 (`pnpm type-check`)
- [ ] 功能测试：
  - [ ] 打开外部链接
  - [ ] 保存文件
  - [ ] 打开文件
  - [ ] 复制到剪贴板
  - [ ] 所有工具正常工作

### 构建验证

- [ ] Web 构建测试 (`pnpm build:web`)
- [ ] Desktop 构建测试 (`pnpm wails:build`)
- [ ] 构建产物验证

### 清理和文档

- [ ] 删除旧的 `frontend/` 和 `web/` 目录
- [ ] 更新 README.md
- [ ] 更新 .gitignore
- [ ] 提交代码

---

## 常见问题

### Q1: 为什么不直接使用条件编译？

**A:** 条件编译虽然简单，但有几个问题：

- 构建配置复杂，难以维护
- 类型推断混乱，IDE 支持差
- 难以处理完全不同的代码路径
- 测试困难，需要多次构建验证

适配器模式提供了更清晰的抽象和更好的类型安全。

### Q2: 适配器会影响性能吗？

**A:** 影响极小：

- 适配器只是一层薄封装
- 现代 JS 引擎会内联简单函数
- 相比代码重复的维护成本，性能损失可忽略
- 可以在构建时优化掉不必要的抽象

### Q3: 如何处理平台特有的组件？

**A:** 三种方式：

1. **条件渲染**：

```vue
<template>
  <DesktopComponent v-if="isDesktop" />
  <WebComponent v-else />
</template>
```

1. **动态组件**：

```vue
<component :is="platformComponent" />
```

1. **独立页面**：在各自 `packages/*/src/pages` 中维护

### Q4: 如何添加新的平台功能？

**A:**

1. 在 `adapters/types.ts` 中扩展接口
2. 在 `web.ts` 和 `desktop.ts` 中实现
3. TypeScript 会确保所有实现都同步更新

### Q5: 开发时如何快速切换平台测试？

**A:**

```bash
# 同时运行两个平台
pnpm dev:web      # 终端 1
pnpm wails:dev    # 终端 2
```

### Q6: 如何处理 Wails 类型定义？

**A:** 在 `packages/desktop/src` 中保留 `wailsjs/` 目录，然后：

```typescript
// packages/core/src/adapters/desktop.ts
// 使用动态导入避免编译错误
declare global {
  interface Window {
    wails?: any;
  }
}

// 只在运行时加载
if (typeof window !== 'undefined' && window.wails) {
  // 导入 Wails API
}
```

### Q7: 如何共享样式？

**A:**

```bash
packages/core/src/styles/
  ├── variables.less     # 共享变量
  ├── mixins.less        # 共享 mixins
  └── common.less        # 通用样式

packages/desktop/src/styles/
  └── desktop.less       # Desktop 特定

packages/web/src/styles/
  └── web.less           # Web 特定
```

### Q8: 构建速度会变慢吗？

**A:** 不会，反而可能更快：

- 核心代码只构建一次
- 可以并行构建各平台
- 更小的依赖图，更快的 HMR

```bash
# 并行构建
pnpm -r --parallel build
```

### Q9: 如何处理第三方库的平台兼容性？

**A:**

```typescript
// 在适配器中封装
export class WebPlatformAdapter {
  async scanQRCode() {
    // Web 使用 html5-qrcode
    const { Html5Qrcode } = await import('html5-qrcode');
    // ...
  }
}

export class DesktopPlatformAdapter {
  async scanQRCode() {
    // Desktop 可能使用系统摄像头 API
    // ...
  }
}
```

### Q10: 迁移过程中如何保持项目可用？

**A:** 渐进式迁移：

1. 创建新分支进行重构
2. 保持旧分支继续维护
3. 完成迁移后合并
4. 或者使用 feature flag 逐步切换

---

## 下一步

迁移完成后，可以考虑：

1. **添加移动端支持**：创建 `packages/mobile`
2. **提取更多共享库**：如 `@localjson/ui`、`@localjson/utils`
3. **改进构建流程**：使用 Turborepo 或 Nx
4. **添加 E2E 测试**：跨平台测试套件
5. **文档站点**：使用 VitePress 建立文档

---

## 参考资源

- [PNPM Workspace](https://pnpm.io/workspaces)
- [Vite 配置指南](https://vitejs.dev/config/)
- [Wails 文档](https://wails.io/docs/introduction)
- [适配器模式](https://refactoring.guru/design-patterns/adapter)

---

**创建时间**: 2025-11-12  
**作者**: GitHub Copilot  
**项目**: LocalJson  
**版本**: 1.0.0
