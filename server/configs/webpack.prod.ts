import merge from 'webpack-merge';
import commonConfig from './webpack.common';

const devConfig = merge(commonConfig, {
    mode: 'production',
    devtool: 'source-map',
});

export default devConfig;
