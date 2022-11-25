import fs from 'node:fs/promises';
import chalk from 'ansi-colors';
import console from 'consola';
import exitHook from 'exit-hook';
import express from 'express';
import waitOn from 'wait-on';
import webpack from 'webpack';

import devConfig from './configs/webpack.dev';
import setupMiddlewares from './middlewares';
import { ENABLE_DEVTOOLS, HOST, PORT as DEFAULT_PORT } from './utils/constants';
import exec from './utils/exec';
import getPort from './utils/getPort';
import { resolveExtension } from './utils/path';

import './watcher';

async function start() {
    if (ENABLE_DEVTOOLS) {
        exec('npx react-devtools').promise.catch((error) => {
            console.error('Startup react-devtools occur error');
            console.error(error);
        });
        const reactDevtoolsJSAddress = 'http://localhost:8097';
        waitOn({ resources: [reactDevtoolsJSAddress, resolveExtension('js')] }).then(async () => {
            const resp = await fetch(reactDevtoolsJSAddress);
            const data = await resp.text();
            fs.writeFile(resolveExtension('js/react-devtools.js'), data, 'utf8');
        });
    }

    const compiler = webpack(devConfig);
    const devServer = express();

    setupMiddlewares(devServer, compiler);
    const PORT = await getPort(HOST, DEFAULT_PORT);
    const httpServer = devServer.listen(PORT, HOST, () => {
        const coloredAddress = chalk.magenta.underline(`http://${HOST}:${PORT}`);
        console.info(`DevServer is running at ${coloredAddress} ✔`);
    });

    exitHook(() => {
        // 先关闭 devServer
        httpServer.close();
        // 在 ctrl + c 的时候随机输出 'See you again' 和 'Goodbye'
        console.log(
            chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`),
        );
    });
}
start();
