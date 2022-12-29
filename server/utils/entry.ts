import fs from 'node:fs';

import { __DEV__, HOST, HRM_PATH, PORT } from './constants';
import { resolveServer, resolveSrc } from './path';

const HMR_URL = encodeURIComponent(`http://${HOST}:${PORT}${HRM_PATH}`);
// !: 必须指定 path 为 devServer 的地址，不然的话热更新 client 会向 chrome://xxx 请求
const HMRClientScript = `webpack-hot-middleware/client?path=${HMR_URL}&reload=true&overlay=true`;

const backgroundPath = resolveSrc('background/index.ts');
const optionsPath = resolveSrc('options/index.tsx');
const popupPath = resolveSrc('popup/index.tsx');

const devEntry: Record<string, string[]> = {
    background: [backgroundPath],
    options: [HMRClientScript, optionsPath],
    popup: [HMRClientScript, popupPath],
};
const prodEntry: Record<string, string[]> = {
    background: [backgroundPath],
    options: [optionsPath],
    popup: [popupPath],
};
const entry = __DEV__ ? devEntry : prodEntry;

const contentsDirs = fs.readdirSync(resolveSrc('contents'));
const validExtensions = ['tsx', 'ts'];
contentsDirs.forEach((contentScriptDir) => {
    const hasValid = validExtensions.some((ext) => {
        const abs = resolveSrc(`contents/${contentScriptDir}/index.${ext}`);
        if (fs.existsSync(abs)) {
            entry[contentScriptDir] = [abs];
            return true;
        }

        return false;
    });

    if (!hasValid) {
        const dir = resolveSrc(`contents/${contentScriptDir}`);
        throw new Error(`You must put index.tsx or index.ts under directory: ${dir}`);
    }
});

// NOTE: 有可能用户没打算开发 content script，所以 contents/all 这个文件夹可能不存在
if (entry.all && __DEV__) {
    entry.all.unshift(resolveServer('client/allTabClient.ts'));
    entry.background.unshift(resolveServer('client/backgroundClient.ts'));
}

export default entry;
