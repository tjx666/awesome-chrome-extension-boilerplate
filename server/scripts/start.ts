import express from 'express';
import chalk from 'chalk';
import webpack from 'webpack';

import webpackMiddlewares from '../middlewares/webpackMiddlewares';
import extAutoReload from '../middlewares/extAutoReload';
import devConfig from '../configs/webpack.dev';
import { HOST, PORT, EXTENSION_AUTO_RELOAD_PATH } from '../utils/constants';

const devServer = express();
const compiler = webpack(devConfig);

webpackMiddlewares(devServer, compiler);
devServer.use(EXTENSION_AUTO_RELOAD_PATH, extAutoReload(compiler));

devServer.listen(PORT, HOST, async error => {
    if (error) {
        console.error(error);
        return;
    }

    const coloredAddress = chalk.magenta.underline(`http://${HOST}:${PORT}`);
    console.log(`${chalk.bgYellow.black(' INFO ')} DevServer is running at ${coloredAddress} ✔`);
});

process.on('SIGINT', () => {
    console.log(chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`));
});
