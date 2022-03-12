import webpackHotMiddleware from '@lukeapage/webpack-hot-middleware';
import { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import devConfig from '../configs/webpack.dev';
import { HRM_PATH } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
