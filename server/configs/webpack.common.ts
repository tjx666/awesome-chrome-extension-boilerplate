import { resolve } from 'path';
import { Configuration, HashedModuleIdsPlugin, DefinePlugin } from 'webpack';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import entry from '../utils/entry';

const projectRoot = resolve(__dirname, '../../');

const getCSSLoaders = (importLoaders: number) => {
    return [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { importLoaders } },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: [autoprefixer()],
            },
        },
    ];
};

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
        new DefinePlugin({
            __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        }),
        new FriendlyErrorsPlugin(),
        new HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20,
        }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
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
        new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
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
                use: getCSSLoaders(1),
            },
            {
                test: /\.less$/,
                use: [
                    ...getCSSLoaders(2),
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: {},
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [...getCSSLoaders(2), 'sass-loader'],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash].[ext]',
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
                            name: '[name]-[hash].[ext]',
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },
};

export default commonConfig;
