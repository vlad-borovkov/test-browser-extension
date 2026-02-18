const btn = document.getElementById('changeColor') as HTMLButtonElement;

btn.addEventListener('click', async () => {
    console.log('clicked');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id) {
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => {
                document.body.style.backgroundColor = 'orange';
            }
        });
    }
});