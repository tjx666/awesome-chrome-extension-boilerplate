import tiza from 'tiza';

const source = new EventSource('http://127.0.0.1:3000/__extension_auto_reload__');

source.addEventListener(
    'open',
    () => {
        tiza.color('green')
            .bold()
            .text('[EAR] connected to extension auto reload SSE server ✔')
            .info();
    },
    false
);

source.addEventListener(
    'message',
    event => {
        console.info('[EAR] received a no event name message, data:', event.data);
    },
    false
);

source.addEventListener(
    'pause',
    () => {
        tiza.color('yellow')
            .bold()
            .text('[EAR] received pause message from server, ready to close connection!')
            .info();

        source.close();
    },
    false
);

source.addEventListener(
    'compiled-successfully',
    (event: EventSourceEvent) => {
        const shouldReload = JSON.parse(event.data).action === 'reload-extension-and-refresh-current-page';

        if (shouldReload) {
            tiza.color('green')
                .bold()
                .text(`[EAR] received the signal to reload chrome extension since modified the content scripts!`)
                .info();
            chrome.tabs.query({}, tabs => {
                tabs.forEach(tab => {
                    if (tab.id) {
                        let received = false;
                        chrome.tabs.sendMessage(
                            tab.id,
                            {
                                from: 'background',
                                action: 'refresh-current-page',
                            },
                            res => {
                                if (!res) return;

                                const { from, action } = res;
                                if (!received && from === 'content script' && action === 'reload extension') {
                                    received = true;
                                    source.close();
                                    tiza.color('green')
                                        .bold()
                                        .text(`Reload extension`)
                                        .info();
                                    chrome.runtime.reload();
                                }
                            }
                        );
                    }
                });
            });
        }
    },
    false
);

source.addEventListener(
    'error',
    (event: EventSourceEvent) => {
        if (event.target!.readyState === 0) {
            console.error('You need to open devServer first!');
        } else {
            console.error(event);
        }
    },
    false
);
