declare module 'speed-measure-webpack-plugin' {
    import { Configuration } from 'webpack';

    interface SpeedMeasurePluginOptions {
        disable: boolean;
        outputFormat:
            | 'json'
            | 'human'
            | 'humanVerbose'
            | ((outputObj: object) => void);
        outputTarget: string | ((outputObj: string) => void);
        pluginNames: object;
        granularLoaderData: boolean;
    }

    class SpeedMeasurePlugin {
        constructor(options?: Partial<SpeedMeasurePluginOptions>);

        wrap(webpackConfig: Configuration): Configuration;
    }

    export = SpeedMeasurePlugin;
}
