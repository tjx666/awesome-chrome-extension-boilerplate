import { resolve } from 'path';
import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import commonConfig from './webpack.common';

const projectRoot = resolve(__dirname, '../../');
const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new CopyPlugin([
            { from: resolve(projectRoot, 'public'), ignore: ['*.html'] },
            {
                from: resolve(projectRoot, 'src/manifest.dev.json'),
                to: 'manifest.json',
            },
        ]),
        new HotModuleReplacementPlugin(),
        new NamedModulesPlugin(),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
        }),
    ],
});

export default devConfig;
