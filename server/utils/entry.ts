import { resolve } from 'path';
import fs from 'fs';
import { Entry } from 'webpack';
import serverConfig from '../configs/server.config';

const sourcePath = resolve(__dirname, '../../src');
const HMRSSEPath = encodeURIComponent(
    `http://${serverConfig.HOST}:${serverConfig.PORT}/__webpack_HMR__`
);
const HMRClientScript = `webpack-hot-middleware/client?path=${HMRSSEPath}&reload=true`;

const devEntry: Entry = {
    background: [HMRClientScript, resolve(sourcePath, './background/index.ts')],
    options: [HMRClientScript, resolve(sourcePath, './options/index.tsx')],
    popup: [HMRClientScript, resolve(sourcePath, './popup/index.tsx')],
};

const prodEntry: Entry = {
    background: [resolve(sourcePath, './background/index.ts')],
    options: [resolve(sourcePath, './options/index.tsx')],
    popup: [resolve(sourcePath, './popup/index.tsx')],
};

const entry = process.env.NODE_ENV === 'development' ? devEntry : prodEntry;

const contentScriptNames = fs.readdirSync(resolve(sourcePath, 'contents'));
contentScriptNames.forEach(name => {
    const existsTsxIndex = fs.existsSync(
        resolve(sourcePath, `contents/${name}/index.tsx`)
    );

    entry[name] = resolve(
        sourcePath,
        `contents/${name}/index.${existsTsxIndex ? 'tsx' : 'ts'}`
    );
});

export default entry;
