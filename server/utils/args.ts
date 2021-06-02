import yargs = require('yargs/yargs');

interface Arguments {
    [x: string]: unknown;
    devtools: boolean;
    analyze: boolean;
    open: string | undefined;
}
const argv = yargs(process.argv.slice(2)).options({
    devtools: { type: 'boolean', default: false },
    analyze: { type: 'boolean', default: false },
    open: { type: 'string' },
}).argv as Arguments;

export default argv;
