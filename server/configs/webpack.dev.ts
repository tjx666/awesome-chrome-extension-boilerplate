import { resolve } from 'path';
import { HotModuleReplacementPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: 1024,
                configFile: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
            },
        }),
    ],
});

export default devConfig;
