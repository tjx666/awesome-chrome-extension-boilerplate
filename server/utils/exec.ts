import type { ChildProcess } from 'node:child_process';
import { exec as _exec } from 'node:child_process';

import { PROJECT_ROOT } from './constants';

export default function exec(command: string) {
    let childProcess: ChildProcess;
    const promise = new Promise<void>((resolve, reject) => {
        childProcess = _exec(
            command,
            {
                cwd: PROJECT_ROOT,
            },
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            },
        );

        childProcess.stdout?.pipe(process.stdout);
        childProcess.stderr?.pipe(process.stderr);
    });

    return {
        // @ts-expect-error In fact, childProcess had been initialized in promise
        childProcess,
        promise,
    };
}
