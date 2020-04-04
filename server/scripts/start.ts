import chalk from 'chalk';
import webpack from 'webpack';
import express from 'express';

import devConfig from '../configs/webpack.dev';
import setupMiddlewares from '../middlewares';
import { HOST, PORT as DEFAULT_PORT } from '../utils/constants';
import getPort from '../utils/getPort';
import openBrowser from '../utils/openBrowser';

async function start() {
    const compiler = webpack(devConfig);
    openBrowser(compiler);
    const devServer = express();

    setupMiddlewares(devServer, compiler);
    const PORT = await getPort(HOST, DEFAULT_PORT);
    const httpServer = devServer.listen(PORT, HOST, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        const coloredAddress = chalk.magenta.underline(`http://${HOST}:${PORT}`);
        console.log(
            `${chalk.bgYellow.black(' INFO ')} DevServer is running at ${coloredAddress} ✔`,
        );
    });

    ['SIGINT', 'SIGTERM'].forEach((signal: any) => {
        process.on(signal, () => {
            // 先关闭 devServer
            httpServer.close();
            // 在 ctrl + c 的时候随机输出 'See you again' 和 'Goodbye'
            console.log(
                chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`),
            );
            // 退出 node 进程
            process.exit();
        });
    });
}
start();
