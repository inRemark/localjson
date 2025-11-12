import type { PlatformAdapter, FileDialogOptions, PlatformInfo, PlatformFeature } from './types';

export class WebPlatformAdapter implements PlatformAdapter {
  readonly type = 'web' as const;

  openURL(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async saveFile(filename: string, content: string, mimeType?: string): Promise<void> {
    // Create a download link
    const link = document.createElement('a');
    
    // Check if the content is Base64 data
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

    // Clean up Object URL
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
    if ('Notification' in globalThis && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }

  isSupported(feature: PlatformFeature): boolean {
    switch (feature) {
      case 'file-system-access':
        return 'showOpenFilePicker' in globalThis;
      case 'native-notifications':
        return 'Notification' in globalThis;
      case 'clipboard':
        return !!globalThis.navigator.clipboard;
      case 'custom-protocols':
        return false;
      default:
        return false;
    }
  }
}

// Export singleton instance
export const webAdapter = new WebPlatformAdapter();
