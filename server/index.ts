import express from 'express';
import chalk from 'chalk';
import devMiddlewares from './middlewares/devMiddlewares';
import serverConfig from './configs/server.config';

const devServer = express();
devMiddlewares(devServer);

const { HOST, PORT } = serverConfig;
devServer.listen(PORT, HOST, async error => {
    if (error) {
        console.error('Startup devServer occur a error!');
        console.error(error);
    } else {
        const address = `http://${HOST}:${PORT}`;
        console.log(
            `DevServer successfully startup at ${chalk.cyan.bold.underline(
                address
            )} ${chalk.green('✓')}!`
        );
    }
});

process.addListener('unhandledRejection', error => {
    console.error('You may have a promise not caught!');
    console.error(error);
});
