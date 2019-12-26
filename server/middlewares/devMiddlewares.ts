import { Express } from 'express';
import { Compiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import devConfig from '../configs/webpack.dev';

export default (app: Express, compiler: Compiler): void => {
    const devMiddlewareOptions: webpackDevMiddleware.Options = {
        publicPath: devConfig!.output!.publicPath!,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        lazy: false,
        stats: {
            all: false,
            modules: true,
            maxModules: 0,
            errors: true,
            warnings: true,
            moduleTrace: true,
            errorDetails: true,
            performance: true,
        },
        writeToDisk: true,
    };
    app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
    app.use(webpackHotMiddleware(compiler, { path: '/__webpack_HMR__' }));
};
