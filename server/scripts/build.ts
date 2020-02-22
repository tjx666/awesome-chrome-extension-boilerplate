import webpack from 'webpack';
import prodConfig from '../configs/webpack.prod';

const compiler = webpack(prodConfig);
compiler.run((error, stats) => {
    if (error) {
        console.error(error);
        return;
    }

    const prodStatsOpts = {
        preset: 'normal',
        colors: true,
    };

    console.log(stats.toString(prodStatsOpts));
});
