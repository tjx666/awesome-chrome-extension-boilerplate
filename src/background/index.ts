import { onMessage } from 'webext-bridge';

onMessage('hello-from-content-script', (msg) => {
    console.log(msg);
});

console.log('This is background page!');
