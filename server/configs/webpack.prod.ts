import { resolve } from 'path';
import { BannerPlugin, HashedModuleIdsPlugin } from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import SizePlugin from 'size-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';

import commonConfig from './webpack.common';
import { PROJECT_ROOT, COPYRIGHT, ENABLE_ANALYZE } from '../utils/constants';

const mergedConfig = merge(commonConfig, {
    mode: 'production',
    plugins: [
        new CopyPlugin([
            {
                from: resolve(PROJECT_ROOT, 'public'),
                ignore: ['*.html'],
            },
            {
                from: resolve(PROJECT_ROOT, 'src/manifest.prod.json'),
                to: 'manifest.json',
            },
        ]),
        new BannerPlugin({
            banner: COPYRIGHT,
            raw: true,
        }),
        new ForkTsCheckerWebpackPlugin({
            memoryLimit: 1024 * 2,
            tsconfig: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
            measureCompilationTime: true,
        }),
        new HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20,
        }),
        new SizePlugin({ writeFile: false }),
        new LodashModuleReplacementPlugin(),
        new AntdDayjsWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                extractComments: false,
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
    },
});

if (ENABLE_ANALYZE) {
    mergedConfig.plugins!.push(new BundleAnalyzerPlugin());
}

const smp = new SpeedMeasurePlugin();
const prodConfig = smp.wrap(mergedConfig);

export default prodConfig;
