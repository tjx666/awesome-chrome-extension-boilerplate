module.exports = (api) => {
    api.cache(true);

    const envPreset = [
        '@babel/env',
        {
            modules: false,
            bugfixes: true,
            useBuiltIns: 'usage',
            corejs: { version: require('./package.json').devDependencies['core-js'] },
        },
    ];

    return {
        presets: ['@babel/preset-typescript', envPreset],
        plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
            'lodash',
        ],
    };
};
