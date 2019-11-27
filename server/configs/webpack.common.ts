import { resolve } from 'path';
import { Configuration, HashedModuleIdsPlugin } from 'webpack';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import entry from '../utils/entry';

const projectRoot = resolve(__dirname, '../../');

const CSSLoaders = (importLoaders: number) => {
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
    watchOptions: {
        ignored: [/node_modules/, /dist/, /docs/, /server/],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js', '.jsx'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': resolve(projectRoot, 'src'),
            utils: resolve(projectRoot, 'src/utils'),
            styles: resolve(projectRoot, 'src/styles'),
        },
    },
    plugins: [
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
            minify: false,
            cache: true,
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            title: 'popup page',
            template: resolve(projectRoot, 'public/popup.html'),
            inject: 'body',
            minify: false,
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
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: CSSLoaders(1),
            },
            {
                test: /\.less$/,
                use: [
                    ...CSSLoaders(2),
                    {
                        loader: 'less-loader',
                        options: {
                            // use modifyVars to custom antd theme
                            modifyVars: {},
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [...CSSLoaders(2), 'sass-loader'],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:8].[ext]',
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

export default commonConfig;
