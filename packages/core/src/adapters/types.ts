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
  | 'clipboard'
  | 'custom-protocols';
