import webpack from 'webpack';
import chalk from 'chalk';

import prodConfig from '../configs/webpack.prod';

function build() {
    const compiler = webpack(prodConfig);

    compiler.run((error, stats) => {
        const compileError: Error & { details?: string } = error;

        if (error) {
            console.log(
                `${chalk.bgRed.black(' ERROR ')} webpack configuration error!`
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
}

build();
