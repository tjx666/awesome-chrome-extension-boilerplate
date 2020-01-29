import { resolve } from 'path';
import { argv } from 'yargs';

const env = String(argv.env || process.env.NODE_ENV || 'production');
const isProd = process.env.NODE_ENV !== 'development';
const projectRoot = resolve(__dirname, '../../');
const copyright =
    'This chrome extension is powered by awesome-chrome-extension-boilerplate(https://github.com/tjx666/awesome-chrome-extension-boilerplate)';

export { env, isProd, projectRoot, copyright };
