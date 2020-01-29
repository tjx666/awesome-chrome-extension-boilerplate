import fs from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { debounce } from 'lodash';
import { RequestHandler } from 'express';
import { Compiler, Stats } from 'webpack';
import SSEStream from 'ssestream';

export default function(compiler: Compiler) {
    const extAutoReload: RequestHandler = (req, res, next) => {
        const prefix = chalk.bgYellow.black(' EAR ');
        console.log(`${prefix} received connection!`);

        res.header('Access-Control-Allow-Origin', '*');
        const sseStream = new SSEStream(req);
        sseStream.pipe(res);
        let closed = false;

        const contentScriptsModules = fs.readdirSync(resolve(__dirname, '../../src/contents'));
        const compileDoneHook = debounce((stats: Stats) => {
            const { modules } = stats.toJson({ all: false, modules: true });
            const shouldReload =
                !stats.hasErrors() &&
                modules &&
                modules.length === 1 &&
                contentScriptsModules.includes(modules[0].chunks[0] as string);

            if (shouldReload) {
                console.log(`${prefix} send extension-reload signal!`);

                sseStream.write(
                    {
                        event: 'compiled-successfully',
                        data: {
                            action: 'reload-extension-and-refresh-current-page',
                        },
                    },
                    'UTF-8',
                    error => {
                        if (error) {
                            console.error(error);
                        }
                    }
                );
            }
        }, 1000);

        // 断开链接后之前的 hook 就不要执行了
        const plugin = (stats: Stats) => !closed && compileDoneHook(stats);
        compiler.hooks.done.tap('extension-auto-reload-plugin', plugin);

        res.on('close', () => {
            closed = true;
            console.log(`${prefix} connection closed!`);
            sseStream.unpipe(res);
        });

        next();
    };

    return extAutoReload;
}
