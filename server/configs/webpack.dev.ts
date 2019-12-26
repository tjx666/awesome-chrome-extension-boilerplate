import { resolve } from 'path';
import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';

const projectRoot = resolve(__dirname, '../../');

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new CopyPlugin([
            { from: resolve(projectRoot, 'public'), ignore: ['*.html'] },
            {
                from: resolve(projectRoot, 'src/manifest.dev.json'),
                to: 'manifest.json',
            },
        ]),
        new HotModuleReplacementPlugin(),
        new NamedModulesPlugin(),
        new ForkTsCheckerWebpackPlugin({ memoryLimit: 1024 }),
    ],
});

export default devConfig;
