import logWithPrefix from './log';

chrome.runtime.onMessage.addListener((request, _sender, sendResp) => {
    const shouldRefresh = request.from === 'background' && request.action === 'refresh current page';
    if (shouldRefresh) {
        const waitingMilliseconds = 500;
        logWithPrefix(`current page will reload after ${waitingMilliseconds}`);
        setTimeout(() => window.location.reload(), waitingMilliseconds);
        sendResp({ from: 'content script', action: 'reload extension' });
    }
});
