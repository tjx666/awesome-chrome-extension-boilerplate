/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import { resolve } from 'path';
import fs from 'fs';
import { argv } from 'yargs';
import { exec as tempExec } from 'child_process';
import tempUtils from 'util';
import serverConfig from '../configs/server.config';

const sourcePath = resolve(__dirname, '../../src');
const HMRSSEPath = encodeURIComponent(
    `http://${serverConfig.HOST}:${serverConfig.PORT}/__webpack_HMR__`
);
const HMRClientScript = `webpack-hot-middleware/client?path=${HMRSSEPath}&reload=true`;

const devEntry: Record<string, string[]> = {
    background: [HMRClientScript, resolve(sourcePath, './background/index.ts')],
    options: [
        HMRClientScript,
        'react-hot-loader/patch',
        resolve(sourcePath, './options/index.tsx'),
    ],
    popup: [
        HMRClientScript,
        'react-hot-loader/patch',
        resolve(sourcePath, './popup/index.tsx'),
    ],
};

const prodEntry: Record<string, string[]> = {
    background: [resolve(sourcePath, './background/index.ts')],
    options: [resolve(sourcePath, './options/index.tsx')],
    popup: [resolve(sourcePath, './popup/index.tsx')],
};

const entry = process.env.NODE_ENV === 'development' ? devEntry : prodEntry;

if (argv.devtools) {
    entry.options.unshift('react-devtools');
    entry.popup.unshift('react-devtools');

    const utils: typeof tempUtils = require('util');
    const exec: typeof tempExec = utils.promisify(
        require('child_process').exec
    );

    (async function startupReactDevtools() {
        let output;
        try {
            output = await exec('npx react-devtools');
        } catch (error) {
            console.error('Startup react-devtools occur error:', error);
            return;
        }

        const { stdout, stderr } = output;
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    })();
}

const contentScriptNames = fs.readdirSync(resolve(sourcePath, 'contents'));
contentScriptNames.forEach(name => {
    const existsTsxIndex = fs.existsSync(
        resolve(sourcePath, `contents/${name}/index.tsx`)
    );

    entry[name] = [
        resolve(
            sourcePath,
            `contents/${name}/index.${existsTsxIndex ? 'tsx' : 'ts'}`
        ),
    ];
});

export default entry;
