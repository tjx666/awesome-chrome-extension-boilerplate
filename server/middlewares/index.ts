import { Compiler } from 'webpack';
import { Express } from 'express';
import cors from 'cors';

import webpackMiddleware from './webpackMiddleware';
import extensionAutoReload from './extensionAutoReload';
import proxyMiddleware from './proxyMiddleware';
import { EXTENSION_AUTO_RELOAD_PATH } from '../utils/constants';

export default function setupMiddlewares(devServer: Express, compiler: Compiler) {
    proxyMiddleware(devServer);
    devServer.use(cors());
    devServer.use(webpackMiddleware(compiler));
    devServer.use(EXTENSION_AUTO_RELOAD_PATH, extensionAutoReload(compiler));
}
