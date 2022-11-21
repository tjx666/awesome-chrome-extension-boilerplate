import fs from 'node:fs/promises';

import manifest from '../src/manifest';
import { resolveExtension } from './utils/path';

export default function generateManifest() {
    return fs.writeFile(
        resolveExtension('manifest.json'),
        JSON.stringify(manifest, null, 4),
        'utf8',
    );
}

if (module === require.main) {
    generateManifest();
}
