/* eslint-disable camelcase, import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
module.exports = (api) => {
    const isProd = api.env('production');
    const { minimum_chrome_version } = require(`./src/manifest.${isProd ? 'prod' : 'dev'}.json`);
    const envPreset = [
        '@babel/env',
        {
            modules: false,
            targets: minimum_chrome_version
                ? `Chrome > ${minimum_chrome_version}`
                : 'last 2 Chrome versions',
            bugfixes: true,
            useBuiltIns: 'usage',
            corejs: { version: require('./package.json').devDependencies['core-js'].slice(1) },
        },
    ];

    const importPlugin = [
        'import',
        {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
        },
    ];

    return {
        presets: ['@babel/preset-typescript', envPreset],
        plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
            'lodash',
            importPlugin,
        ],
        env: {
            development: {
                presets: [['@babel/preset-react', { runtime: 'automatic', development: true }]],
                plugins: [require.resolve('react-refresh/babel')],
            },
            production: {
                presets: ['@babel/preset-react'],
                plugins: [
                    '@babel/plugin-transform-react-constant-elements',
                    '@babel/plugin-transform-react-inline-elements',
                ],
            },
        },
    };
};
