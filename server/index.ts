import { __DEV__ } from './utils/constants';

require(`./scripts/${__DEV__ ? 'start' : 'build'}`);
