import { sendMessage } from 'webext-bridge';

import './style.scss';

sendMessage('hello-from-content-script', 'hello!', 'background');
console.log(`Current page's url must be prefixed with https://github.com`);
