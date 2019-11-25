/* eslint-disable global-require, @typescript-eslint/no-var-requires */

const isProd = process.env.NODE_ENV !== 'development';

if (isProd) {
    require('./scripts/build')();
} else {
    require('./scripts/start')();
}

export default null;
