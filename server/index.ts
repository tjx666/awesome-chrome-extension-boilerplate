import { isProd } from './utils/env';

require(`./scripts/${isProd ? 'build' : 'start'}`);
