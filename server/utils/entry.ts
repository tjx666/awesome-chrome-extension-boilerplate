import { resolve } from 'path';
import fs from 'fs';
import { argv } from 'yargs';
import { command } from 'execa';

import serverConfig from '../configs/server.config';
import { isProd } from './env';

const src = resolve(__dirname, '../../src');
const HMRSSEPath = encodeURIComponent(`http://${serverConfig.HOST}:${serverConfig.PORT}/__webpack_HMR__`);
const HMRClientScript = `webpack-hot-middleware/client?path=${HMRSSEPath}&reload=true`;

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
const entry = isProd ? prodEntry : devEntry;

if (argv.devtools) {
    entry.options.unshift('react-devtools');
    entry.popup.unshift('react-devtools');
    command('npx react-devtools').catch(err => {
        console.error('Startup react-devtools occur error');
        console.error(err);
    });
}

const scriptNames = fs.readdirSync(resolve(src, 'contents'));
const validExts = ['tsx', 'ts'];
scriptNames.forEach(name => {
    const hasValid = validExts.some(ext => {
        const abs = resolve(src, `contents/${name}/index.${ext}`);
        if (fs.existsSync(abs)) {
            entry[name] = [abs];
            return true;
        }

        return false;
    });

    if (!hasValid) {
        const dir = resolve(src, `contents/${name}`);
        console.error(`You must put index.tsx or index.is under ${dir}`);
    }
});

if (entry.all && !isProd) {
    entry.all.unshift(resolve(__dirname, './autoRefreshPatch.ts'));
    entry.background.unshift(resolve(__dirname, './autoReloadPatch.ts'));
}

export default entry;
