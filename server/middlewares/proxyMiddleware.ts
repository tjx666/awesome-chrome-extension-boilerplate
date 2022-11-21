import chalk from 'ansi-colors';
import console from 'consola';
import type { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import proxyTable from '../configs/proxy';

function link(str: string) {
    return chalk.magenta.underline(str);
}

export default function proxyMiddleware(server: Express): void {
    Object.entries(proxyTable).forEach(([path, options]) => {
        const from = path;
        const to = options.target as string;
        console.info(`proxy ${link(from)} ${chalk.green('->')} ${link(to)}`);

        if (!options.logLevel) options.logLevel = 'warn';
        server.use(path, createProxyMiddleware(options));
    });
    process.stdout.write('\n');
}
