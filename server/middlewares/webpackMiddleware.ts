import { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import devConfig from '../configs/webpack.dev';
import { HRM_PATH } from '../utils/constants';

export default function (compiler: Compiler) {
    const publicPath = devConfig.output!.publicPath!;
    const devMiddlewareOptions: webpackDevMiddleware.Options = {
        publicPath,
        stats: 'minimal',
        writeToDisk: true,
    };
    return [
        webpackDevMiddleware(compiler, devMiddlewareOptions),
        webpackHotMiddleware(compiler, { path: HRM_PATH }),
    ];
}
