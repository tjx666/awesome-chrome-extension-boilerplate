import tiza from 'tiza';

chrome.runtime.onMessage.addListener((request, _sender, sendResp) => {
    const shouldRefresh = request.from === 'background' && request.action === 'refresh-current-page';

    if (shouldRefresh) {
        tiza.color('green')
            .bold()
            .text('[EAR] received signal to refresh current page since modified the content scripts!')
            .info();
        setTimeout(() => window.location.reload(), 500);
        sendResp({ from: 'content script', action: 'reload extension' });
    }
});
