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
  if (typeof globalThis.window !== 'undefined' && (globalThis.window as any).wails) {
    setPlatformAdapter(desktopAdapter);
  } else {
    setPlatformAdapter(webAdapter);
  }
}
