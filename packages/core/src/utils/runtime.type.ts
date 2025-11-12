export function isWebView() {
    const userAgent = window.navigator.userAgent || window.navigator.vendor;

    // 检查常见的 WebView 标识符
    const isAndroidWebView = /wv/.test(userAgent) || /Android.*AppleWebKit/.test(userAgent);
    const isIOSWebView = /iPhone|iPod|iPad.*AppleWebKit(?!.*Safari)/.test(userAgent);

    // 检查 macOS 和 Windows 的 WebView 标识符
    const isMacOSWebView = /Macintosh.*AppleWebKit(?!.*Safari)/.test(userAgent);
    const isWindowsWebView = /Windows.*AppleWebKit(?!.*Safari)/.test(userAgent);

    return isAndroidWebView || isIOSWebView || isMacOSWebView || isWindowsWebView;
}

export function isBrowser() {
    return !isWebView();
}