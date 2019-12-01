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

    interface ProgressBarPluginOptions {
        format: string;
        clear: boolean;
    }

    class ProgressBarPlugin {
        constructor(options?: Partial<ProgressBarPluginOptions>);
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
        constructor(options?: SizePluginOptions);
        apply(compiler: Compiler): void;
    }

    export = SizePlugin;
}

declare module 'ssestream' {
    import { Request } from 'express';
    import { Transform } from 'stream';

    /**
     * Transforms "messages" to W3C event stream content.
     * See https://html.spec.whatwg.org/multipage/server-sent-events.html
     * A message is an object with one or more of the following properties:
     * - data (String or object, which gets turned into JSON)
     * - event
     * - id
     * - retry
     * - comment
     *
     * If constructed with a HTTP Request, it will optimise the socket for streaming.
     * If this stream is piped to an HTTP Response, it will set appropriate headers.
     */
    class SSEStream extends Transform {
        constructor(req: Request);
    }

    export = SSEStream;
}
