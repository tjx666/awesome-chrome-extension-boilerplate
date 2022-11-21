import console from 'consola';
import webpack from 'webpack';

import prodConfig from './configs/webpack.prod';
import generateManifest from './generateManifest';
import { ENABLE_ANALYZE } from './utils/constants';

function webpackBuild() {
    const compiler = webpack(prodConfig);
    return new Promise<void>((resolve, reject) => {
        compiler.run((error, stats) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }

            if (stats) {
                const { errors } = stats.toJson({ all: false, errors: true });

                if (stats.hasErrors()) {
                    console.error(errors);
                    reject(new Error(JSON.stringify(errors, undefined, 4)));
                    return;
                }

                const analyzeStatsOpts = {
                    preset: 'normal',
                    colors: true,
                };
                console.log(stats.toString(ENABLE_ANALYZE ? analyzeStatsOpts : 'minimal'));
            }

            resolve();
        });
    });
}

function main() {
    generateManifest();
    webpackBuild();
}

main();
