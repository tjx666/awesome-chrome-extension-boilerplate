import webpack from 'webpack';
import chalk from 'chalk';

import prodConfig from '../configs/webpack.prod';

export = () => {
    const compiler = webpack(prodConfig);
    compiler.run((error, stats) => {
        const compileError: Error & { details?: string } = error;
        if (error) {
            console.log(
                `${chalk.redBright.bold('ERROR')} webpack configuration error!`
            );
            console.error(error);

            if (compileError.details) {
                console.error(compileError.details);
            }

            return;
        }

        console.log(
            stats.toString({
                colors: true,
            })
        );
    });
};
