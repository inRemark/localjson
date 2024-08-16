import {defineStore} from 'pinia';
import {SaveBase64File} from 'wailsjs/go/services/fileService';
import {isBrowser, isWebView} from "@/utils/runtime.type";
import {useDownloadFileFromBase64} from "@/composable/downloadBase64";

export const useFileStore = defineStore('file', {
    state: () => ({
        isWebView: isWebView(),
        isBrowser: isBrowser(),
    }),
    actions: {
        async saveFile(filename: string, data: any) {
            if (isWebView()) {
                try {
                    await SaveBase64File(data.value, filename);
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.log("is not WebView");
                const {download} = useDownloadFileFromBase64({
                    source: data, filename: filename
                });
                download();
            }
        }
    }
})


export default useFileStore