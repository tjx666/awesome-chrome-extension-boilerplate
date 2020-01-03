import { argv } from 'yargs';

const env = String(argv.env || process.env.NODE_ENV || 'production');
const isProd = process.env.NODE_ENV !== 'development';

export { env, isProd };
