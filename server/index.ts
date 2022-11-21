import { generateManifest } from '../src/manifest';
import { __DEV__ } from './utils/constants';

generateManifest();
require(`./scripts/${__DEV__ ? 'start' : 'build'}`);
