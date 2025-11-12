import {defineStore} from 'pinia';
import {isBrowser, isWebView} from "@/utils/runtime.type";
import {useDownloadFileFromBase64} from "@/composable/downloadBase64";
import { usePlatform } from '../adapters';

export const useFileStore = defineStore('file', () => {
    const platform = usePlatform();
    const isWebViewValue = isWebView();
    const isBrowserValue = isBrowser();

    async function saveFile(filename: string, data: any) {
        try {
            // 使用平台适配器保存文件
            await platform.saveFile(filename, data.value || data);
        } catch (error) {
            // Fallback to browser download if platform save fails
            console.log("Platform save failed, using browser download");
            const {download} = useDownloadFileFromBase64({
                source: data, filename: filename
            });
            download();
        }
    }

    return {
        isWebView: isWebViewValue,
        isBrowser: isBrowserValue,
        saveFile
    };
})


export default useFileStore