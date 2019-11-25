import { resolve } from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import commonConfig from './webpack.common';

const projectRoot = resolve(__dirname, '../../');

const smp = new SpeedMeasurePlugin();
const mergedConfig = merge(commonConfig, {
    mode: 'production',
    plugins: [
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
    ],
});
const devConfig = smp.wrap(mergedConfig);

export default devConfig;
