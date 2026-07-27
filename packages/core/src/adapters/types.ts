/**
 * PlatformAdapter interface
 */
export interface PlatformAdapter {
  
  readonly type: 'web' | 'desktop';

  /**
   * Open a URL in an external browser
   * @param url - The URL to open
   */
  openURL(url: string): void;

  /**
   * Save a file to the local filesystem
   * @param filename - The name of the file
   * @param content - The content of the file (Base64 or text)
   * @param mimeType - The MIME type
   *
   * @param filename - file name
   * @param content - file content (Base64 or text)
   * @param mimeType - MIME type
   */
  saveFile(filename: string, content: string, mimeType?: string): Promise<void>;

  /**
   * Open a file dialog
   * @param options - file dialog options
   * @returns The selected file
   */
  openFileDialog(options?: FileDialogOptions): Promise<File | File[] | null>;

  /**
   * Copy text to clipboard
   * @param text - The text to copy
   */
  copyToClipboard(text: string): Promise<void>;

  /**
   * Get platform information
   */
  getPlatformInfo(): PlatformInfo;

  /**
   * Show a notification
   * @param title - The notification title
   * @param message - The notification message
   */
  showNotification?(title: string, message: string): void;

  /**
   * Check if a feature is supported
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
