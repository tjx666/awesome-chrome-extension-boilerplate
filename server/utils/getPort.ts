import _getPort from 'get-port';

/**
 * 获取可用端口，被占用后加一
 */
export default async function getPort(host: string, port: number): Promise<number> {
    const result = await _getPort({ host, port });

    // 没被占用就返回这个端口号
    if (result === port) {
        return result;
    }

    // 递归，端口号 +1
    return getPort(host, port + 1);
}
