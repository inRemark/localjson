
export * from './types';
import type { PlatformAdapter } from './types';


let currentAdapter: PlatformAdapter | null = null;

export function setPlatformAdapter(adapter: PlatformAdapter): void {
  currentAdapter = adapter;
  console.log(`[Platform] Adapter set to: ${adapter.type}`);
}

export function getPlatformAdapter(): PlatformAdapter {
  if (!currentAdapter) {
    throw new Error(
      'Platform adapter not initialized. Call setPlatformAdapter() in your main.ts'
    );
  }
  return currentAdapter;
}

/**
 * Vue Composable
 */
export function usePlatform(): PlatformAdapter {
  return getPlatformAdapter();
}

export function isWebPlatform(): boolean {
  return currentAdapter?.type === 'web';
}

export function isDesktopPlatform(): boolean {
  return currentAdapter?.type === 'desktop';
}

