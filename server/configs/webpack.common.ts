import FriendlyErrorsPlugin from '@nuxt/friendly-errors-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';

import { __DEV__, ENABLE_DEVTOOLS, PROJECT_ROOT } from '../utils/constants';
import entry from '../utils/entry';
import { resolveExtension, resolvePublic, resolveSrc } from '../utils/path';

function getCssLoaders(importLoaders: number) {
    return [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
            options: {
                // disable css module by default
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
        path: resolveExtension(),
        filename: 'js/[name].js',
        // 将热更新临时生成的补丁放到 hot 文件夹中
        hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'hot/[runtime].[fullhash].hot-update.json',
        clean: {
            keep: (filename) => {
                return filename === 'manifest.json' || filename === 'js/react-devtools.js';
            },
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
            '@': resolveSrc(),
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: resolvePublic(),
                    globOptions: {
                        ignore: ['**/public/*.html'],
                    },
                },
            ],
        }),
        new WebpackBar({
            name: 'Building chrome extension',
            color: '#0f9d58',
        }),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            filename: 'options.html',
            title: 'options page',
            template: resolvePublic('options.html'),
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'popup page',
            template: resolvePublic('popup.html'),
        }),
        new MiniCssExtractPlugin({
            filename: `css/[name].css`,
            ignoreOrder: false,
        }),
        new FriendlyErrorsPlugin({
            clearConsole: false,
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

if (ENABLE_DEVTOOLS) {
    commonConfig.plugins!.push(
        new HtmlWebpackTagsPlugin({
            tags: ['js/react-devtools.js'],
            append: false,
            files: ['options.html', 'popup.html'],
        }),
    );
}

export default commonConfig;
