import { resolve as _resolve } from 'node:path';

import { PROJECT_ROOT } from './constants';

export function resolveProject(...args: string[]) {
    return _resolve(PROJECT_ROOT, ...args);
}

export function resolveExtension(...args: string[]) {
    return resolveProject('extension', ...args);
}

export function resolvePublic(...args: string[]) {
    return resolveProject('public', ...args);
}

export function resolveServer(...args: string[]) {
    return resolveProject('server', ...args);
}

export function resolveSrc(...args: string[]) {
    return resolveProject('src', ...args);
}
