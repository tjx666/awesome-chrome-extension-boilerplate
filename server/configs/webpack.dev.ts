import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { resolve } from 'path';
import { HotModuleReplacementPlugin } from 'webpack';
import merge from 'webpack-merge';

import { PROJECT_ROOT } from '../utils/constants';
import commonConfig from './webpack.common';

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: 'whm',
            },
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: 1024,
                configFile: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
            },
        }),
    ],
});

export default devConfig;
