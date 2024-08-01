import fs from 'node:fs/promises';
import console from 'consola';

import manifest from '../src/manifest';
import { ensureDir } from './utils/fs';
import { resolveExtension } from './utils/path';

export default async function generateManifest() {
    console.info('updating manifest.json...');
    await ensureDir(resolveExtension());
    return fs.writeFile(
        resolveExtension('manifest.json'),
        JSON.stringify(manifest, null, 4),
        'utf8',
    );
}

if (module === require.main) {
    generateManifest();
}
