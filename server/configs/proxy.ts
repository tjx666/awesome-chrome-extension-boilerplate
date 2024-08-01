import type { Options } from 'http-proxy-middleware/dist/types';

export interface ProxyTable {
    [path: string]: Options;
}

const proxyTable: ProxyTable = {
    // '/path_to_be_proxy': { target: 'http://target.domain.com', changeOrigin: true },
};

export default proxyTable;
