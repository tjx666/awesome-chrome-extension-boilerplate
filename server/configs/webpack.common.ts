import { resolve } from 'path';
import { HashedModuleIdsPlugin, BannerPlugin, DefinePlugin, Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WebpackBar from 'webpackbar';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options as HtmlMinifierOptions } from 'html-minifier';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import entry from '../utils/entry';
import { PROJECT_ROOT, COPYRIGHT, __DEV__, ENABLE_DEVTOOLS } from '../utils/constants';

function getCssLoaders(importLoaders: number) {
    return [
        {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: __DEV__ },
        },
        { loader: 'css-loader', options: { importLoaders } },
    ];
}

const htmlMinifyOptions: HtmlMinifierOptions = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    useShortDoctype: true,
};

const commonConfig: Configuration = {
    entry,
    output: {
        publicPath: '/',
        path: resolve(PROJECT_ROOT, 'extension'),
        filename: 'js/[name].js',
        hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
        hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': resolve(PROJECT_ROOT, 'src'),
            utils: resolve(PROJECT_ROOT, 'src/utils'),
            styles: resolve(PROJECT_ROOT, 'src/styles'),
        },
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new BannerPlugin({
            banner: `/** @preserve ${COPYRIGHT} */`,
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
            cwd: PROJECT_ROOT,
        }),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            filename: 'options.html',
            title: 'options page',
            template: resolve(PROJECT_ROOT, 'public/options.html'),
            inject: 'body',
            cache: true,
        }),
        new HtmlWebpackPlugin({
            minify: __DEV__ ? false : htmlMinifyOptions,
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'popup page',
            template: resolve(PROJECT_ROOT, 'public/popup.html'),
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
                use: getCssLoaders(0),
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
                            limit: 1024 * 10,
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

if (!ENABLE_DEVTOOLS) {
    commonConfig.plugins!.push(
        new DefinePlugin({
            __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        }),
    );
}

export default commonConfig;
