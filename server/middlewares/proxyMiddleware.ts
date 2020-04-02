import { Express } from 'express';
import chalk from 'chalk';
import { createProxyMiddleware } from 'http-proxy-middleware';

import proxyTable from '../configs/proxy';

function link(str: string) {
    return chalk.magenta.underline(str);
}

export default function proxyMiddleware(server: Express) {
    Object.entries(proxyTable).forEach(([path, options]) => {
        const from = path;
        const to = options.target as string;
        console.log(`proxy ${link(from)} ${chalk.green('->')} ${link(to)}`);

        // eslint-disable-next-line no-param-reassign
        if (!options.logLevel) options.logLevel = 'warn';
        server.use(path, createProxyMiddleware(options));
    });
    process.stdout.write('\n');
}
