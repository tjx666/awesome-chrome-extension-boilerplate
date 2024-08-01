import { constants as FS_CONSTANTS } from 'node:fs';
import fs from 'node:fs/promises';

export function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

export async function ensureDir(dir: string) {
    if (!(await pathExists(dir))) {
        await fs.mkdir(dir, { recursive: true });
    }
}
