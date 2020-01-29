import { resolve } from 'path';
import { argv } from 'yargs';
import { HashedModuleIdsPlugin, BannerPlugin, DefinePlugin, Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WebpackBar from 'webpackbar';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import entry from '../utils/entry';
import { projectRoot, copyright } from '../utils/env';

function getCssLoaders(importLoaders = 0) {
    return [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders } }];
}

const commonConfig: Configuration = {
    entry,
    output: {
        publicPath: '/',
        path: resolve(projectRoot, 'dist'),
        filename: 'js/[name].js',
        hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
        hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': resolve(projectRoot, 'src'),
            utils: resolve(projectRoot, 'src/utils'),
            styles: resolve(projectRoot, 'src/styles'),
        },
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new BannerPlugin({
            banner: `/** @preserve ${copyright} */`,
            raw: true,
        }),
        new WebpackBar({
            name: 'chrome extension',
            color: '#0f9d58',
        }),
        new FriendlyErrorsPlugin(),
        new CaseSensitivePathsPlugin(),
        new HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20,
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: projectRoot,
        }),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            filename: 'options.html',
            title: 'options page',
            template: resolve(projectRoot, 'public/options.html'),
            inject: 'body',
            cache: true,
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'popup page',
            template: resolve(projectRoot, 'public/popup.html'),
            inject: 'body',
            cache: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: false,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: getCssLoaders(),
            },
            {
                test: /\.less$/,
                use: [...getCssLoaders(1), 'less-loader'],
            },
            {
                test: /\.scss$/,
                use: [...getCssLoaders(1), 'sass-loader'],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[contenthash].[ext]',
                            outputPath: 'images',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[contenthash].[ext]',
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },
};

if (!argv.devtools) {
    commonConfig.plugins!.push(
        new DefinePlugin({
            __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        })
    );
}

export default commonConfig;
