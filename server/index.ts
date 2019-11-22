import express from 'express';
import chalk from 'chalk';
import devMiddlewares from './middlewares/devMiddlewares';

const app = express();
devMiddlewares(app);

app.listen(3000, '127.0.0.1', async error => {
    if (error) {
        console.error('Start server error:', error);
    } else {
        console.log(
            `Server started at http://127.0.0.1:3000! ${chalk.green('✓')}`
        );
    }
});

process.addListener('uncaughtException', error => {
    console.error(error);
});
