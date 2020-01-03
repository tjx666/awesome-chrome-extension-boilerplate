import tiza from 'tiza';

const source = new EventSource(
    // !: the domain can't be ignore, or will use the page domain
    'http://127.0.0.1:3000/__extension_auto_reload__'
);

source.addEventListener(
    'open',
    () => {
        tiza.color('green')
            .bold()
            .text('Connected to extension auto reload SSE server!')
            .info();
    },
    false
);

source.addEventListener(
    'message',
    event => {
        console.info('Received a no event name message, data:', event.data);
    },
    false
);

source.addEventListener(
    'pause',
    () => {
        tiza.color('yellow')
            .bold()
            .text(
                'Received pause message from server, ready to close connection'
            )
            .info();
        source.close();
    },
    false
);

source.addEventListener(
    'compiled-successfully',
    (event: EventSourceEvent) => {
        // prettier-ignore
        if (JSON.parse(event.data).action === 'reload-extension-and-refresh-current-page') {
            chrome.runtime.sendMessage(
                {
                    from: 'refined-nowcoder-content-script',
                    action: 'reload-whole-extension',
                },
                response => {
                    if (response.from === 'background') {
                        if (response.action === 'refresh-current-page') {
                            source.close();
                            setTimeout(() => {
                                window.location.reload();
                            }, 200);
                        }
                    }
                }
            );
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
