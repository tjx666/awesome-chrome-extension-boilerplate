import express from 'express';
import chalk from 'chalk';
import webpack from 'webpack';
import logSymbols from 'log-symbols';

import webpackMiddlewares from '../middlewares/webpackMiddlewares';
import extAutoReload from '../middlewares/extAutoReload';
import serverConfig from '../configs/server.config';
import devConfig from '../configs/webpack.dev';

(function start() {
    const devServer = express();
    const compiler = webpack(devConfig);

    webpackMiddlewares(devServer, compiler);
    devServer.use('/__extension_auto_reload__', extAutoReload(compiler));

    const { HOST, PORT } = serverConfig;
    devServer.listen(PORT, HOST, async error => {
        if (error) {
            console.error(`${chalk.bgRed.black(' ERROR ')} Startup devServer occur a error!`);
            console.error(error);
        } else {
            const coloredAddress = chalk.magenta.underline(`http://${HOST}:${PORT}`);
            console.log(
                `${chalk.bgYellow.black(' INFO ')} DevServer is running at ${coloredAddress} ${logSymbols.success}`
            );
        }
    });

    process.addListener('unhandledRejection', error => {
        console.error('You may have a promise not caught!');
        console.error(error);
    });

    process.on('exit', () => {
        console.log(chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`));
    });
})();
