import { Express } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import devConfig from '../configs/webpack.dev';

export default (app: Express): void => {
    const options = {
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

    const compiler = webpack(devConfig);
    const middleware = webpackDevMiddleware(compiler, options);

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler, { path: '/__webpack_HMR__' }));
};
