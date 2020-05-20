import fs from 'fs';
import { resolve } from 'path';
import { debounce } from 'lodash';
import { RequestHandler } from 'express';
import { Compiler, Stats } from 'webpack';
import SSEStream from 'ssestream';

export default function extensionAutoReload(compiler: Compiler): RequestHandler {
    return (req, res, next) => {
        const sseStream = new SSEStream(req);
        sseStream.pipe(res);

        let closed = false;
        const contentScriptsModules = fs.readdirSync(resolve(__dirname, '../../src/contents'));
        const compileDoneHook = debounce((stats: Stats) => {
            const { modules } = stats.toJson({ all: false, modules: true });
            const shouldReload =
                !stats.hasErrors() &&
                modules?.length === 1 &&
                contentScriptsModules.includes(modules[0].chunks[0] as string);

            if (shouldReload) {
                sseStream.write(
                    {
                        event: 'compiled successfully',
                        data: {
                            action: 'reload extension and refresh current page',
                        },
                    },
                    'utf-8',
                    (err) => {
                        if (err) {
                            console.error(err);
                        }
                    },
                );
            }
        }, 1000);

        // 断开链接后之前的 hook 就不要执行了
        const plugin = (stats: Stats) => {
            if (!closed) {
                compileDoneHook(stats);
            }
        };
        compiler.hooks.done.tap('extension-auto-reload-plugin', plugin);

        res.on('close', () => {
            closed = true;
            sseStream.unpipe(res);
        });

        next();
    };
}
