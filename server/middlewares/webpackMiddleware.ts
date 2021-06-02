import { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import devConfig from '../configs/webpack.dev';
import { HRM_PATH } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (compiler: Compiler) {
    const publicPath = devConfig.output!.publicPath! as string;
    const devMiddlewareOptions: webpackDevMiddleware.Options = {
        publicPath,
        stats: 'minimal',
        writeToDisk: true,
    };
    return [
        webpackDevMiddleware(compiler, devMiddlewareOptions),
        webpackHotMiddleware(compiler as any, { path: HRM_PATH }),
    ];
}
