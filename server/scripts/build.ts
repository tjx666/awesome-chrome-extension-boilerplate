import webpack from 'webpack';

import prodConfig from '../configs/webpack.prod';
import { ENABLE_ANALYZE } from '../utils/constants';

const compiler = webpack(prodConfig);
compiler.run((error, stats) => {
    if (error) {
        console.error(error);
        return;
    }

    const analyzeStatsOpts = {
        preset: 'normal',
        colors: true,
    };

    console.log(stats.toString(ENABLE_ANALYZE ? analyzeStatsOpts : 'minimal'));
});
