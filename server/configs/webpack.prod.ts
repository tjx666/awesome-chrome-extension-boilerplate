import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { resolve } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, { BannerPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';

import { COPYRIGHT, ENABLE_ANALYZE, PROJECT_ROOT } from '../utils/constants';
import commonConfig from './webpack.common';

const prodConfig = merge(commonConfig, {
    mode: 'production',
    plugins: [
        new BannerPlugin({
            banner: COPYRIGHT,
            raw: true,
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: 1024 * 2,
                configFile: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
                profile: ENABLE_ANALYZE,
            },
        }),
        new webpack.ids.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20,
        }),
        new AntdDayjsWebpackPlugin(),
        new CssMinimizerPlugin(),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[/\\]node_modules[/\\](react|react-dom)[/\\]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
            }),
        ],
    },
});

if (ENABLE_ANALYZE) {
    prodConfig.plugins!.push(new BundleAnalyzerPlugin());
}

export default prodConfig;
