/*
 _       __      _ __
| |     / /___ _(_) /____
| | /| / / __ `/ / / ___/
| |/ |/ / /_/ / / (__  )
|__/|__/\__,_/_/_/____/
The electron alternative for Go
(c) Lea Anthony 2019-present
*/

export function LogPrint(message) {
    globalThis.runtime.LogPrint(message);
}

export function LogTrace(message) {
    globalThis.runtime.LogTrace(message);
}

export function LogDebug(message) {
    globalThis.runtime.LogDebug(message);
}

export function LogInfo(message) {
    globalThis.runtime.LogInfo(message);
}

export function LogWarning(message) {
    globalThis.runtime.LogWarning(message);
}

export function LogError(message) {
    globalThis.runtime.LogError(message);
}

export function LogFatal(message) {
    globalThis.runtime.LogFatal(message);
}

export function EventsOnMultiple(eventName, callback, maxCallbacks) {
    return globalThis.runtime.EventsOnMultiple(eventName, callback, maxCallbacks);
}

export function EventsOn(eventName, callback) {
    return EventsOnMultiple(eventName, callback, -1);
}

export function EventsOff(eventName, ...additionalEventNames) {
    return globalThis.runtime.EventsOff(eventName, ...additionalEventNames);
}

export function EventsOffAll() {
  return globalThis.runtime.EventsOffAll();
}

export function EventsOnce(eventName, callback) {
    return EventsOnMultiple(eventName, callback, 1);
}

export function EventsEmit(eventName) {
    let args = [eventName].slice.call(arguments);
    return globalThis.runtime.EventsEmit.apply(null, args);
}

export function WindowReload() {
    globalThis.runtime.WindowReload();
}

export function WindowReloadApp() {
    globalThis.runtime.WindowReloadApp();
}

export function WindowSetAlwaysOnTop(b) {
    globalThis.runtime.WindowSetAlwaysOnTop(b);
}

export function WindowSetSystemDefaultTheme() {
    globalThis.runtime.WindowSetSystemDefaultTheme();
}

export function WindowSetLightTheme() {
    globalThis.runtime.WindowSetLightTheme();
}

export function WindowSetDarkTheme() {
    globalThis.runtime.WindowSetDarkTheme();
}

export function WindowCenter() {
    globalThis.runtime.WindowCenter();
}

export function WindowSetTitle(title) {
    globalThis.runtime.WindowSetTitle(title);
}

export function WindowFullscreen() {
    globalThis.runtime.WindowFullscreen();
}

export function WindowUnfullscreen() {
    globalThis.runtime.WindowUnfullscreen();
}

export function WindowIsFullscreen() {
    return globalThis.runtime.WindowIsFullscreen();
}

export function WindowGetSize() {
    return globalThis.runtime.WindowGetSize();
}

export function WindowSetSize(width, height) {
    globalThis.runtime.WindowSetSize(width, height);
}

export function WindowSetMaxSize(width, height) {
    globalThis.runtime.WindowSetMaxSize(width, height);
}

export function WindowSetMinSize(width, height) {
    globalThis.runtime.WindowSetMinSize(width, height);
}

export function WindowSetPosition(x, y) {
    globalThis.runtime.WindowSetPosition(x, y);
}

export function WindowGetPosition() {
    return globalThis.runtime.WindowGetPosition();
}

export function WindowHide() {
    globalThis.runtime.WindowHide();
}

export function WindowShow() {
    globalThis.runtime.WindowShow();
}

export function WindowMaximise() {
    globalThis.runtime.WindowMaximise();
}

export function WindowToggleMaximise() {
    globalThis.runtime.WindowToggleMaximise();
}

export function WindowUnmaximise() {
    globalThis.runtime.WindowUnmaximise();
}

export function WindowIsMaximised() {
    return globalThis.runtime.WindowIsMaximised();
}

export function WindowMinimise() {
    globalThis.runtime.WindowMinimise();
}

export function WindowUnminimise() {
    globalThis.runtime.WindowUnminimise();
}

export function WindowSetBackgroundColour(R, G, B, A) {
    globalThis.runtime.WindowSetBackgroundColour(R, G, B, A);
}

export function ScreenGetAll() {
    return globalThis.runtime.ScreenGetAll();
}

export function WindowIsMinimised() {
    return globalThis.runtime.WindowIsMinimised();
}

export function WindowIsNormal() {
    return globalThis.runtime.WindowIsNormal();
}

export function BrowserOpenURL(url) {
    globalThis.runtime.BrowserOpenURL(url);
}

export function Environment() {
    return globalThis.runtime.Environment();
}

export function Quit() {
    globalThis.runtime.Quit();
}

export function Hide() {
    globalThis.runtime.Hide();
}

export function Show() {
    globalThis.runtime.Show();
}

export function ClipboardGetText() {
    return globalThis.runtime.ClipboardGetText();
}

export function ClipboardSetText(text) {
    return globalThis.runtime.ClipboardSetText(text);
}

/**
 * Callback for OnFileDrop returns a slice of file path strings when a drop is finished.
 *
 * @export
 * @callback OnFileDropCallback
 * @param {number} x - x coordinate of the drop
 * @param {number} y - y coordinate of the drop
 * @param {string[]} paths - A list of file paths.
 */

/**
 * OnFileDrop listens to drag and drop events and calls the callback with the coordinates of the drop and an array of path strings.
 *
 * @export
 * @param {OnFileDropCallback} callback - Callback for OnFileDrop returns a slice of file path strings when a drop is finished.
 * @param {boolean} [useDropTarget=true] - Only call the callback when the drop finished on an element that has the drop target style. (--wails-drop-target)
 */
export function OnFileDrop(callback, useDropTarget) {
    return globalThis.runtime.OnFileDrop(callback, useDropTarget);
}

/**
 * OnFileDropOff removes the drag and drop listeners and handlers.
 */
export function OnFileDropOff() {
    return globalThis.runtime.OnFileDropOff();
}

export function CanResolveFilePaths() {
    return globalThis.runtime.CanResolveFilePaths();
}

export function ResolveFilePaths(files) {
    return globalThis.runtime.ResolveFilePaths(files);
}