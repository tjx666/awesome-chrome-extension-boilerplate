/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import { resolve } from 'path';
import { argv } from 'yargs';
import webpack from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin as TempBundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import commonConfig from './webpack.common';

const projectRoot = resolve(__dirname, '../../');

const plugins: webpack.Plugin[] = [
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
    new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
        algorithm: 'gzip',
        cache: true,
        threshold: 10240,
        minRatio: 0.9,
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
});

const smp = new SpeedMeasurePlugin();
const devConfig = smp.wrap(mergedConfig);

export default devConfig;
