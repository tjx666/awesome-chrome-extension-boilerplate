import cors from 'cors';
import type { Express } from 'express';
import type { Compiler } from 'webpack';

import { EXTENSION_AUTO_RELOAD_PATH } from '../utils/constants';
import extensionAutoReload from './extensionAutoReload';
import proxyMiddleware from './proxyMiddleware';
import webpackMiddleware from './webpackMiddleware';

export default function setupMiddlewares(devServer: Express, compiler: Compiler): void {
    proxyMiddleware(devServer);
    devServer.use(cors());
    devServer.use(webpackMiddleware(compiler));
    devServer.use(EXTENSION_AUTO_RELOAD_PATH, extensionAutoReload(compiler));
}
