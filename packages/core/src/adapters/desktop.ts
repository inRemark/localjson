import type { PlatformAdapter, FileDialogOptions, PlatformInfo, PlatformFeature } from './types';

// 注意:这些导入在 packages/desktop 中会被正确解析
// 在 core 包中编译时会有警告,但不影响使用
let BrowserOpenURL: ((url: string) => void) | undefined;
let SaveBase64File: ((filename: string, data: string) => Promise<void>) | undefined;
let Environment: (() => Promise<any>) | undefined;

// 延迟初始化 promise
let wailsInitialized = false;
const initWails = async () => {
  if (wailsInitialized) return;
  if (typeof globalThis === 'undefined' || !(globalThis as any).wails) return;
  
  try {
    // 动态导入 Wails 函数(仅在 desktop 环境中可用)
    // @ts-ignore - Wails runtime 仅在 desktop 环境中可用
    const runtime = await import('@wailsjs/runtime/runtime');
    // @ts-ignore
    const fileService = await import('@wailsjs/go/services/fileService');
    
    BrowserOpenURL = runtime.BrowserOpenURL;
    SaveBase64File = fileService.SaveBase64File;
    Environment = runtime.Environment;
    wailsInitialized = true;
  } catch (e) {
    console.warn('Wails runtime not available:', e);
  }
};

export class DesktopPlatformAdapter implements PlatformAdapter {
  readonly type = 'desktop' as const;
  
  // 静态初始化块，确保异步操作在类加载时执行
  static {
    if (typeof globalThis !== 'undefined') {
      initWails();
    }
  }

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
    if (navigator.clipboard?.writeText) {
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
      version: '4.0.0',
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
    if ('Notification' in globalThis) {
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
      case 'custom-protocols':
        return true;
      default:
        return false;
    }
  }
}

// 导出单例实例
export const desktopAdapter = new DesktopPlatformAdapter();
