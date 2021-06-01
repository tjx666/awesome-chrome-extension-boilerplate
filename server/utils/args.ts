import yargs = require('yargs/yargs');

interface Arguments {
    [x: string]: unknown;
    devtools: boolean;
    analyze: boolean;
}
const argv = yargs(process.argv.slice(2)).options({
    devtools: { type: 'boolean', default: false },
    analyze: { type: 'boolean', default: false },
}).argv as Arguments;

export default argv;
