import logInfoWithPrefix from './logger';

chrome.runtime.onMessage.addListener((request, _sender, sendResp) => {
    const shouldRefresh = request.from === 'background' && request.action === 'refresh-current-page';
    if (shouldRefresh) {
        logInfoWithPrefix('received signal to refresh current page since modified the content scripts!');
        setTimeout(() => window.location.reload(), 500);
        sendResp({ from: 'content script', action: 'reload extension' });
    }
});
