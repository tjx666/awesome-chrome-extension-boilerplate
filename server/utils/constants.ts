import { resolve } from 'node:path';

import argv from './args';

const HOST = '127.0.0.1';
const PORT = 3600;
const PROJECT_ROOT = resolve(__dirname, '../../');
const COPYRIGHT = `/**
 * This chrome extension is powered by awesome-chrome-extension-boilerplate
 *
 * @see {@link https://github.com/tjx666/awesome-chrome-extension-boilerplate}
 * @preserve
 */`;
const HRM_PATH = '/__webpack_HMR__';
const EXTENSION_AUTO_RELOAD_PATH = '/__extension_auto_reload__';

const ENABLE_DEVTOOLS = argv.devtools;
const ENABLE_ANALYZE = argv.analyze;

const __DEV__ = process.env.NODE_ENV !== 'production';

export {
    __DEV__,
    COPYRIGHT,
    ENABLE_ANALYZE,
    ENABLE_DEVTOOLS,
    EXTENSION_AUTO_RELOAD_PATH,
    HOST,
    HRM_PATH,
    PORT,
    PROJECT_ROOT,
};
