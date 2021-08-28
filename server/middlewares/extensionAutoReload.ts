import { RequestHandler } from 'express';
import { debounce } from 'lodash';
import { resolve } from 'path';
import SSEStream from 'ssestream';
import { Compiler, Stats } from 'webpack';

export default function extensionAutoReload(compiler: Compiler): RequestHandler {
    return (req, res, next) => {
        const sseStream = new SSEStream(req);
        sseStream.pipe(res);

        let closed = false;

        const compileDoneHook = debounce((stats: Stats) => {
            const { modules } = stats.toJson({ all: false, modules: true });
            const updatedJsModules = modules?.filter(
                (module) => module.type === 'module' && module.moduleType === 'javascript/auto',
            );
            const shouldReload =
                !stats.hasErrors() &&
                updatedJsModules?.some((module) =>
                    module.nameForCondition?.startsWith(resolve(__dirname, '../../src/contents')),
                );
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
