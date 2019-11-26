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

declare module 'progress-bar-webpack-plugin' {
    import { Compiler } from 'webpack';

    class ProgressBarPlugin {
        apply(compiler: Compiler): void;
    }
    export = ProgressBarPlugin;
}

declare module 'size-plugin' {
    import { Compiler } from 'webpack';
    interface SizePluginOptions {
        writeFile?: boolean;
    }

    class SizePlugin {
        constructor(options: SizePluginOptions);
        apply(compiler: Compiler): void;
    }
    export = SizePlugin;
}
