import { resolve } from 'path';
import { HotModuleReplacementPlugin } from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new CopyPlugin([
            { from: resolve(PROJECT_ROOT, 'public'), ignore: ['*.html'] },
            {
                from: resolve(PROJECT_ROOT, 'src/manifest.dev.json'),
                to: 'manifest.json',
            },
        ]),
        new HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            memoryLimit: 1024,
            tsconfig: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
        }),
    ],
});

export default devConfig;
