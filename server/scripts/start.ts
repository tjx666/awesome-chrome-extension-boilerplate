import express from 'express';
import chalk from 'chalk';
import webpack from 'webpack';
import logSymbols from 'log-symbols';

import devMiddlewares from '../middlewares/devMiddlewares';
import extensionAutoReload from '../middlewares/extensionAutoReload';
import serverConfig from '../configs/server.config';
import devConfig from '../configs/webpack.dev';

const start = () => {
    const devServer = express();
    const compiler = webpack(devConfig);
    devMiddlewares(devServer, compiler);
    devServer.use('/__extension_auto_reload__', extensionAutoReload(compiler));

    const { HOST, PORT } = serverConfig;
    devServer.listen(PORT, HOST, async error => {
        if (error) {
            console.error(
                `${chalk.red.bold('ERROR')} Startup devServer occur a error!`
            );
            console.error(error);
        } else {
            const address = `http://${HOST}:${PORT}`;
            // prettier-ignore
            console.log(`${chalk.bgYellow.black.bold(' INFO ')} DevServer is running at ${chalk.magenta.bold.underline(address)} ${logSymbols.success}`);
        }
    });

    process.addListener('unhandledRejection', error => {
        console.error('You may have a promise not caught!');
        console.error(error);
    });

    process.on('SIGINT', () => {
        console.log(
            chalk.greenBright.bold(
                `\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`
            )
        );
        process.exit();
    });
};

export = start;
