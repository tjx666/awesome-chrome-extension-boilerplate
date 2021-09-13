import FriendlyErrorsPlugin from '@soda/friendly-errors-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';

import { __DEV__, PROJECT_ROOT } from '../utils/constants';
import entry from '../utils/entry';

function getCssLoaders(importLoaders: number) {
    return [
        {
            loader: MiniCssExtractPlugin.loader,
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

const commonConfig: Configuration = {
    context: PROJECT_ROOT,
    entry,
    watchOptions: {
        ignored: ['node_modules/**', 'extension/**'],
    },
    output: {
        publicPath: '/',
        path: resolve(PROJECT_ROOT, 'extension'),
        filename: 'js/[name].js',
        // 将热更新临时生成的补丁放到 hot 文件夹中
        hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'hot/[runtime].[fullhash].hot-update.json',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
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
            chunks: ['options'],
            filename: 'options.html',
            title: 'options page',
            template: resolve(PROJECT_ROOT, 'public/options.html'),
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'popup page',
            template: resolve(PROJECT_ROOT, 'public/popup.html'),
        }),
        new MiniCssExtractPlugin({
            filename: `css/[name].css`,
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
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                generator: {
                    filename: 'images/[hash][ext][query]',
                },
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                generator: {
                    filename: 'fonts/[hash][ext][query]',
                },
            },
        ],
    },
};

export default commonConfig;
