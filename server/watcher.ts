import { exec } from 'node:child_process';
import chokidar from 'chokidar';

import { PROJECT_ROOT } from './utils/constants';
import { resolveProject, resolveSrc } from './utils/path';

function generateManifestInAnotherProcess() {
    exec(
        'npx ts-node ./server/generateManifest.ts',
        {
            cwd: PROJECT_ROOT,
        },
        () => {
            // ignore
        },
    );
}
generateManifestInAnotherProcess();
chokidar.watch([resolveSrc('manifest.ts'), resolveProject('package.json')]).on('change', () => {
    generateManifestInAnotherProcess();
});
