const btn = document.getElementById('changeColor') as HTMLButtonElement;

btn.addEventListener('click', async () => {
    console.log('clicked');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id && tab.url && !tab.url.startsWith('chrome://')) {
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => {
                document.body.style.backgroundColor = 'orange';
            }
        });
    } else if (tab.url?.startsWith('chrome://')) {
        console.warn('Cannot inject scripts into chrome:// pages.');
    }
});
