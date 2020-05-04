import { resolve } from 'path';
import fs from 'fs';
import { command } from 'execa';

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
    options: [HMRClientScript, 'react-hot-loader/patch', optionsPath],
    popup: [HMRClientScript, 'react-hot-loader/patch', popupPath],
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
    command('npx react-devtools').catch((error) => {
        console.error('Startup react-devtools occur error');
        if (error) {
            console.error(error);
        }
    });
}

const scriptNames = fs.readdirSync(resolve(src, 'contents'));
const validExtensions = ['tsx', 'ts'];
scriptNames.forEach((name) => {
    const hasValid = validExtensions.some((ext) => {
        const abs = resolve(src, `contents/${name}/index.${ext}`);
        if (fs.existsSync(abs)) {
            entry[name] = [abs];
            return true;
        }

        return false;
    });

    if (!hasValid) {
        const dir = resolve(src, `contents/${name}`);
        throw new Error(`You must put index.tsx or index.is under ${dir}`);
    }
});

if (entry.all && __DEV__) {
    entry.all.unshift(resolve(__dirname, './autoRefreshClient.ts'));
    entry.background.unshift(resolve(__dirname, './autoReloadClient.ts'));
}

export default entry;
