import './style.css';

const statusEl = document.getElementById('status')!;
const toggleBtn = document.getElementById('toggleRecording') as HTMLButtonElement;

async function updateUI() {
    chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATUS' }, (response) => {
        const isRecording = response?.isRecording || false;
        statusEl.textContent = isRecording ? chrome.i18n.getMessage('recordingOn') : chrome.i18n.getMessage('recordingOff');
        statusEl.className = isRecording ? 'status-on' : 'status-off';
        toggleBtn.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
    });
}

toggleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATUS' }, (response) => {
        const nextStatus = !response?.isRecording;
        chrome.runtime.sendMessage({ type: 'SET_RECORDING_STATUS', status: nextStatus }, () => {
            updateUI();
        });
    });
});

// Initial UI load
updateUI();
