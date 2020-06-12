import { resolve } from 'path';
import { DefinePlugin, Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import WebpackBar from 'webpackbar';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// eslint-disable-next-line import/no-unresolved
import { Options as HtmlMinifierOptions } from 'html-minifier';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import entry from '../utils/entry';
import { PROJECT_ROOT, __DEV__, ENABLE_DEVTOOLS } from '../utils/constants';

function getCssLoaders(importLoaders: number) {
    return [
        {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: __DEV__ },
        },
        {
            loader: 'css-loader',
            options: {
                modules: false,
                sourceMap: true,
                importLoaders,
            },
        },
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
    context: PROJECT_ROOT,
    entry,
    watchOptions: {
        ignored: [/node_modules/, /extension/, /public/],
    },
    output: {
        publicPath: '/',
        path: resolve(PROJECT_ROOT, 'extension'),
        filename: 'js/[name].js',
        // 将热更新临时生成的补丁放到 hot 文件夹中
        hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
        hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': resolve(PROJECT_ROOT, 'src'),
            utils: resolve(PROJECT_ROOT, 'src/utils'),
            styles: resolve(PROJECT_ROOT, 'src/styles'),
        },
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new CopyPlugin({
            patterns: [
                {
                    from: resolve(PROJECT_ROOT, 'public'),
                    globOptions: {
                        ignore: ['**/public/*.html'],
                    },
                },
                {
                    from: resolve(PROJECT_ROOT, `src/manifest.${__DEV__ ? 'dev' : 'prod'}.json`),
                    to: 'manifest.json',
                },
            ],
        }),
        new WebpackBar({
            name: 'chrome extension',
            color: '#0f9d58',
        }),
        new FriendlyErrorsPlugin(),
        new HtmlWebpackPlugin({
            minify: __DEV__ ? false : htmlMinifyOptions,
            chunks: ['options'],
            filename: 'options.html',
            title: 'options page',
            template: resolve(PROJECT_ROOT, 'public/options.html'),
        }),
        new HtmlWebpackPlugin({
            minify: __DEV__ ? false : htmlMinifyOptions,
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'popup page',
            template: resolve(PROJECT_ROOT, 'public/popup.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            ignoreOrder: false,
        }),
    ],
    module: {
        noParse: /jquery/,
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
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
                use: [
                    ...getCssLoaders(1),
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: {
                                    // 修改 antd 主题
                                    // '@primary-color': '#1DA57A',
                                },
                            },
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    ...getCssLoaders(1),
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
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
            // 移除控制台下载 react devtools 的提示
            __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        }),
    );
}

export default commonConfig;
