import webpack from 'webpack';

import prodConfig from './configs/webpack.prod';
import { ENABLE_ANALYZE } from './utils/constants';

const compiler = webpack(prodConfig);
compiler.run((error, stats) => {
    if (error) {
        console.error(error);
        throw error;
    }

    if (stats) {
        const { errors } = stats.toJson({ all: false, errors: true });

        if (stats.hasErrors()) {
            console.error(errors);
            throw new Error(JSON.stringify(errors, undefined, 4));
        }

        const analyzeStatsOpts = {
            preset: 'normal',
            colors: true,
        };
        console.log(stats.toString(ENABLE_ANALYZE ? analyzeStatsOpts : 'minimal'));
    }
});
