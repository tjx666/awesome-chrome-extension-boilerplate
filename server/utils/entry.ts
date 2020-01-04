import { resolve } from 'path';
import fs from 'fs';
import { argv } from 'yargs';
import { command } from 'execa';

import serverConfig from '../configs/server.config';
import { isProd } from './env';

const src = resolve(__dirname, '../../src');
const HMRSSEPath = encodeURIComponent(`http://${serverConfig.HOST}:${serverConfig.PORT}/__webpack_HMR__`);
const HMRClientScript = `webpack-hot-middleware/client?path=${HMRSSEPath}&reload=true`;

const devEntry: Record<string, string[]> = {
    background: [HMRClientScript, resolve(src, './background/index.ts')],
    options: [HMRClientScript, 'react-hot-loader/patch', resolve(src, './options/index.tsx')],
    popup: [HMRClientScript, 'react-hot-loader/patch', resolve(src, './popup/index.tsx')],
};

const prodEntry: Record<string, string[]> = {
    background: [resolve(src, './background/index.ts')],
    options: [resolve(src, './options/index.tsx')],
    popup: [resolve(src, './popup/index.tsx')],
};

const entry = isProd ? prodEntry : devEntry;

if (argv.devtools) {
    entry.options.unshift('react-devtools');
    entry.popup.unshift('react-devtools');
    command('npx react-devtools').catch(err => {
        console.error('Startup react-devtools occur error:', err);
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

if (!isProd) {
    entry.all.unshift(resolve(__dirname, './autoRefreshPatch.ts'));
    entry.background.unshift(resolve(__dirname, './autoReloadPatch.ts'));
}

export default entry;
