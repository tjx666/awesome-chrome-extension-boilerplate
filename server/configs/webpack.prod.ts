import { resolve } from 'path';
import { Plugin } from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import SizePlugin from 'size-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import commonConfig from './webpack.common';
import { PROJECT_ROOT, ENABLE_ANALYZE } from '../utils/constants';

const plugins: Plugin[] = [
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
    new ForkTsCheckerWebpackPlugin({
        memoryLimit: 1024 * 2,
        tsconfig: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
        measureCompilationTime: true,
    }),
    new SizePlugin({ writeFile: false }),
    new HardSourceWebpackPlugin({
        info: { mode: 'none', level: 'error' },
    }),
];

if (ENABLE_ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
}

const mergedConfig = merge(commonConfig, {
    mode: 'production',
    plugins,
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
const smp = new SpeedMeasurePlugin();
const prodConfig = smp.wrap(mergedConfig);

export default prodConfig;
