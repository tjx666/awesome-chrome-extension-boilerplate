chrome.runtime.onMessage.addListener((request, _sender, sendResp) => {
    const shouldRefresh =
        request.from === 'background' && request.action === 'refresh current page';
    if (shouldRefresh) {
        sendResp({ from: 'content script', action: 'reload extension' });
        // !: 等待扩展 reload
        setTimeout(() => window.location.reload(), 100);
    }
});

export {};
