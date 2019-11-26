import { resolve } from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

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

const commonConfig: webpack.Configuration = {
    entry: resolve(projectRoot, 'src/options/index.tsx'),
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
    },
    plugins: [
        new ProgressBarPlugin(),
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({ memoryLimit: 1024 }),
        new HtmlWebpackPlugin({
            filename: 'options.html',
            title: 'Refined Nowcoder - 选项与帮助',
            template: resolve(projectRoot, 'public/options.html'),
            inject: 'body',
            minify: false,
            cache: true,
        }),
        new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
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
