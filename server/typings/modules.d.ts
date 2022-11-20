declare module 'speed-measure-webpack-plugin' {
    import { StringDecoder } from 'string_decoder';
    import { Configuration, Plugin } from 'webpack';

    interface SpeedMeasurePluginOptions {
        disable: boolean;
        outputFormat:
            | 'json'
            | 'human'
            | 'humanVerbose'
            | ((outputObj: Record<StringDecoder, unknown>) => void);
        outputTarget: string | ((outputObj: string) => void);
        pluginNames: Record<StringDecoder, unknown>;
        granularLoaderData: boolean;
    }

    class SpeedMeasurePlugin extends Plugin {
        constructor(options?: Partial<SpeedMeasurePluginOptions>);
        wrap(webpackConfig: Configuration): Configuration;
    }

    export = SpeedMeasurePlugin;
}

declare module 'antd-dayjs-webpack-plugin' {
    import { Plugin } from 'webpack';

    class WebpackDayjsPlugin extends Plugin {
        apply(compiler: Compiler): void;
    }

    export = WebpackDayjsPlugin;
}

declare module 'ssestream' {
    import { Request } from 'express';
    import { Transform } from 'stream';

    class SSEStream extends Transform {
        constructor(req: Request);
    }

    export = SSEStream;
}

declare module '@nuxt/friendly-errors-webpack-plugin' {
    import type { Plugin, Compiler } from 'webpack';

    declare class FriendlyErrorsWebpackPlugin extends Plugin {
        constructor(options?: FriendlyErrorsWebpackPlugin.Options);

        apply(compiler: Compiler): void;
    }

    declare namespace FriendlyErrorsWebpackPlugin {
        // eslint-disable-next-line no-shadow
        enum Severity {
            Error = 'error',
            Warning = 'warning',
        }

        interface WebpackError {
            message: string;
            file: string;
            origin: string;
            name: string;
            severity: Severity;
            webpackError: any;
        }

        interface Options {
            compilationSuccessInfo?: {
                messages: string[];
                notes: string[];
            };
            onErrors?(severity: Severity, errors: string): void;
            clearConsole?: boolean;
            additionalFormatters?: Array<(errors: WebpackError[], type: Severity) => string[]>;
            additionalTransformers?: Array<(error: any) => any>;
        }
    }

    export = FriendlyErrorsWebpackPlugin;
}

declare module 'webpack-hot-middleware' {
    import webpackHotMiddleware from '@types/webpack-hot-middleware';

    export = webpackHotMiddleware;
}
