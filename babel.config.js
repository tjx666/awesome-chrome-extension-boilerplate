/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires, @typescript-eslint/camelcase */
module.exports = api => {
    const isProd = api.env('production');
    const { minimum_chrome_version } = require(`./src/manifest.${isProd ? 'prod' : 'dev'}.json`);
    const envPreset = [
        '@babel/env',
        {
            targets: minimum_chrome_version
                ? `Chrome > ${minimum_chrome_version}`
                : 'last 2 Chrome versions',
            useBuiltIns: 'usage',
            corejs: 3,
        },
    ];

    return {
        presets: ['@babel/preset-typescript', envPreset],
        plugins: ['@babel/plugin-transform-runtime', 'lodash'],
        env: {
            development: {
                presets: [['@babel/preset-react', { development: true }]],
                plugins: ['react-hot-loader/babel'],
            },
            production: {
                presets: ['@babel/preset-react'],
                plugins: [
                    'babel-plugin-dev-expression',
                    '@babel/plugin-transform-react-constant-elements',
                    '@babel/plugin-transform-react-inline-elements',
                ],
            },
        },
    };
};
