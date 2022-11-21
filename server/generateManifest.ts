import fs from 'node:fs/promises';
import console from 'consola';

import manifest from '../src/manifest';
import { resolveExtension } from './utils/path';

export default function generateManifest() {
    console.info('updating manifest.json...');
    return fs.writeFile(
        resolveExtension('manifest.json'),
        JSON.stringify(manifest, null, 4),
        'utf8',
    );
}

if (module === require.main) {
    generateManifest();
}
