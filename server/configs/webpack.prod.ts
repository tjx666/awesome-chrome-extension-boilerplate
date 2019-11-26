/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import { resolve } from 'path';
import { argv } from 'yargs';
import { Plugin } from 'webpack';
import merge from 'webpack-merge';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin as TempBundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SizePlugin from 'size-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import commonConfig from './webpack.common';

const projectRoot = resolve(__dirname, '../../');

const plugins: Plugin[] = [
    new ProgressBarPlugin({ clear: false }),
    new CopyPlugin([
        {
            from: resolve(projectRoot, 'public'),
            ignore: ['*.html'],
        },
        {
            from: resolve(projectRoot, 'src/manifest.prod.json'),
            to: 'manifest.json',
        },
    ]),
    new ForkTsCheckerWebpackPlugin({ memoryLimit: 2048 }),
    new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
        algorithm: 'gzip',
        cache: true,
        threshold: 10240,
        minRatio: 0.9,
    }),
    new SizePlugin({ writeFile: false }),
    new HardSourceWebpackPlugin({
        info: { mode: 'none', level: 'error' },
    }),
];

if (argv.analyze) {
    // eslint-disable-next-line prefer-destructuring
    const BundleAnalyzerPlugin: typeof TempBundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin;
    plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: true }));
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
                sourceMap: true,
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
});

const smp = new SpeedMeasurePlugin();
const devConfig = smp.wrap(mergedConfig);

export default devConfig;
