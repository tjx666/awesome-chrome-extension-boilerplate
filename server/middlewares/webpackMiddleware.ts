import type { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import devConfig from '../configs/webpack.dev';
import { HRM_PATH } from '../utils/constants';

export default function (compiler: Compiler) {
    const publicPath = devConfig.output!.publicPath! as string;
    return [
        webpackDevMiddleware(compiler, {
            publicPath,
            stats: 'minimal',
            writeToDisk: true,
        }),
        webpackHotMiddleware(compiler as any, { path: HRM_PATH }),
    ];
}
