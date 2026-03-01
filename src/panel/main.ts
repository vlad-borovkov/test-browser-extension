import './style.css';
import { generateDTO } from '../core/generator';
import { StorageManager, AppSettings } from '../storage';

const requestListEl = document.getElementById('request-list')!;
const codePreviewEl = document.getElementById('code-preview')!;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
const toggleRecordBtn = document.getElementById('toggle-record-btn') as HTMLButtonElement;
const recordingIndicatorEl = document.getElementById('recording-indicator')!;

let requests: any[] = [];
let isRecording = false;

async function init() {
    chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATUS' }, (response) => {
        isRecording = response?.isRecording || false;
        updateRecordingUI();
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.isRecording) {
            isRecording = !!changes.isRecording.newValue;
            updateRecordingUI();
        }
        if (changes.settings) {
            updateTheme((changes.settings.newValue as AppSettings).theme);
        }
    });

    const settings = await StorageManager.getSettings();
    updateTheme(settings.theme);

    toggleRecordBtn.onclick = () => {
        const nextStatus = !isRecording;
        chrome.runtime.sendMessage({ type: 'SET_RECORDING_STATUS', status: nextStatus }, () => {
            isRecording = nextStatus;
            updateRecordingUI();
        });
    };

    chrome.devtools.network.onRequestFinished.addListener(handleRequest);
}

function updateRecordingUI() {
    recordingIndicatorEl.className = isRecording ? 'status-indicator status-recording' : 'status-indicator';
    toggleRecordBtn.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
}

function updateTheme(theme: 'light' | 'dark' | 'auto') {
    let actualTheme: 'light' | 'dark';
    if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        actualTheme = isDark ? 'dark' : 'light';
    } else {
        actualTheme = theme;
    }
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${actualTheme}`);
}

// System theme listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
    const settings = await StorageManager.getSettings();
    if (settings.theme === 'auto') {
        updateTheme('auto');
    }
});

function handleRequest(request: any) {
    if (!isRecording) return;

    const response = request.response;
    const mimeType = response.content.mimeType || '';
    const isJson = mimeType.includes('json');
    const isSuccess = response.status >= 200 && response.status < 300;

    // Debug logging for user
    console.log(`[TypeFastDTO] Intercepted: ${request.request.method} ${request.request.url} | Status: ${response.status} | MIME: ${mimeType}`);

    if (isJson && isSuccess) {
        const item = {
            id: crypto.randomUUID(),
            url: request.request.url,
            method: request.request.method,
            request
        };
        requests.push(item);
        addRequestToList(item);
    }
}

function addRequestToList(item: any) {
    const el = document.createElement('div');
    el.className = 'request-item';
    const fileName = item.url.split('/').pop() || item.url;
    el.textContent = `${item.method} ${fileName}`;
    el.onclick = () => selectRequest(item, el);
    requestListEl.appendChild(el);
}

async function selectRequest(item: any, element: HTMLElement) {
    document.querySelectorAll('.request-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    item.request.getContent(async (content: string) => {
        try {
            const json = JSON.parse(content);
            const settings = await StorageManager.getSettings();
            const tsCode = generateDTO(json, 'Response', settings);

            // Apply code to preview
            codePreviewEl.textContent = tsCode;
        } catch (e) {
            codePreviewEl.textContent = '// Failed to parse JSON body';
        }
    });
}

copyBtn.onclick = () => {
    const code = codePreviewEl.textContent;
    if (code) {
        navigator.clipboard.writeText(code);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 1500);
    }
};

clearBtn.onclick = () => {
    requests = [];
    requestListEl.innerHTML = '';
    codePreviewEl.textContent = '// Select a request to see TS interface';
};

init();
