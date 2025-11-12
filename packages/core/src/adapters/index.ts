
export * from './types';
import type { PlatformAdapter } from './types';

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

