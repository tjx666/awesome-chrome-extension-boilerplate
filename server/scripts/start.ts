import chalk from 'chalk';
import webpack from 'webpack';
import express from 'express';

import devConfig from '../configs/webpack.dev';
import setupMiddlewares from '../middlewares';
import { HOST, PORT } from '../utils/constants';

const compiler = webpack(devConfig);
const devServer = express();

setupMiddlewares(devServer, compiler);
devServer.listen(PORT, HOST, err => {
    if (err) {
        console.error(err);
        return;
    }

    const coloredAddress = chalk.magenta.underline(`http://${HOST}:${PORT}`);
    console.log(`${chalk.bgYellow.black(' INFO ')} DevServer is running at ${coloredAddress} ✔`);
});

process.on('SIGINT', () => {
    console.log(chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`));
});
