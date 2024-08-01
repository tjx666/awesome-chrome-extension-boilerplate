import chokidar from 'chokidar';

import exec from './utils/exec';
import { resolveProject, resolveSrc } from './utils/path';

function generateManifest() {
    return exec('npx ts-node ./server/generateManifest.ts').promise.catch(() => {
        // ignore, mainly is ts compile error
    });
}
// run once when start
generateManifest();
chokidar.watch([resolveSrc('manifest.ts'), resolveProject('package.json')]).on('change', () => {
    generateManifest();
});
