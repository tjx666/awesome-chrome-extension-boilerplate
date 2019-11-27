// 处理修改 content scripts 自动重载
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.from === 'refined-nowcoder-content-script') {
        if (request.action === 'reload-whole-extension') {
            console.log('ready to reload...');
            sendResponse({
                from: 'background',
                action: 'refresh-current-page',
            });
            chrome.runtime.reload();
        }
    }
});

export default null;
