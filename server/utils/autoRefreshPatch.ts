import tiza from 'tiza';

chrome.runtime.onMessage.addListener((request, sender, sendResp) => {
    const shouldRefresh = request.from === 'background' && request.action === 'refresh-current-page';

    if (shouldRefresh) {
        tiza.color('green')
            .bold()
            .text('Receive signal to refresh current page as modify the content script!')
            .info();
        setTimeout(() => {
            window.location.reload();
        }, 500);
        sendResp({
            from: 'content script',
            action: 'reload extension',
        });
    }
});
