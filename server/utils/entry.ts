import fs from 'fs';
import { resolve } from 'path';

import execa from 'execa';

import { HOST, PORT, HRM_PATH, __DEV__, ENABLE_DEVTOOLS } from './constants';

const src = resolve(__dirname, '../../src');
const HMR_URL = encodeURIComponent(`http://${HOST}:${PORT}${HRM_PATH}`);
// !: 必须指定 path 为 devServer 的地址，不然的话热更新 client 会向 chrome://xxx 请求
const HMRClientScript = `webpack-hot-middleware/client?path=${HMR_URL}&reload=true&overlay=true`;

const backgroundPath = resolve(src, './background/index.ts');
const optionsPath = resolve(src, './options/index.tsx');
const popupPath = resolve(src, './popup/index.tsx');

const devEntry: Record<string, string[]> = {
    background: [HMRClientScript, backgroundPath],
    options: [HMRClientScript, optionsPath],
    popup: [HMRClientScript, popupPath],
};
const prodEntry: Record<string, string[]> = {
    background: [backgroundPath],
    options: [optionsPath],
    popup: [popupPath],
};
const entry = __DEV__ ? devEntry : prodEntry;

if (ENABLE_DEVTOOLS) {
    entry.options.unshift('react-devtools');
    entry.popup.unshift('react-devtools');
    execa.command('npx react-devtools').catch((error) => {
        console.error('Startup react-devtools occur error');
        error && console.error(error);
    });
}

const contentsDirs = fs.readdirSync(resolve(src, 'contents'));
const validExtensions = ['tsx', 'ts'];
contentsDirs.forEach((contentScriptDir) => {
    const hasValid = validExtensions.some((ext) => {
        const abs = resolve(src, `contents/${contentScriptDir}/index.${ext}`);
        if (fs.existsSync(abs)) {
            entry[contentScriptDir] = [abs];
            return true;
        }

        return false;
    });

    if (!hasValid) {
        const dir = resolve(src, `contents/${contentScriptDir}`);
        throw new Error(`You must put index.tsx or index.ts under directory: ${dir}`);
    }
});

// NOTE: 有可能用户没打算开发 content script，所以 contents/all 这个文件夹可能不存在
if (entry.all && __DEV__) {
    entry.all.unshift(resolve(__dirname, './allTabClient.ts'));
    entry.background.unshift(resolve(__dirname, './backgroundClient.ts'));
}

export default entry;
