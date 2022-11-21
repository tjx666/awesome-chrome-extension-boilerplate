import { resolve as _resolve } from 'node:path';

import { PROJECT_ROOT } from './constants';

export function resolve(...args: string[]) {
    return _resolve(PROJECT_ROOT, ...args);
}

export function resolvePublic(...args: string[]) {
    return resolve('public', ...args);
}

export function resolveSrc(...args: string[]) {
    return resolve('src', ...args);
}

export function resolveServer(...args: string[]) {
    return resolve('server', ...args);
}
