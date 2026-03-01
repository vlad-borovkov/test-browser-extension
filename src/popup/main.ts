import './style.css';
import { StorageManager, AppSettings } from '../storage';

const statusEl = document.getElementById('status')!;
const toggleBtn = document.getElementById('toggleRecording') as HTMLButtonElement;
const prefixInput = document.getElementById('prefix') as HTMLInputElement;
const suffixInput = document.getElementById('suffix') as HTMLInputElement;
const themeSelect = document.getElementById('theme') as HTMLSelectElement;
const languageSelect = document.getElementById('language') as HTMLSelectElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const statusMsg = document.getElementById('status-msg')!;

async function loadSettings() {
    const settings = await StorageManager.getSettings();
    prefixInput.value = settings.prefix;
    suffixInput.value = settings.suffix;
    themeSelect.value = settings.theme;
    languageSelect.value = settings.language;
    updateTheme(settings.theme);
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

async function updateUI() {
    chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATUS' }, (response) => {
        const isRecording = response?.isRecording || false;
        statusEl.textContent = isRecording ? 'Recording: ON' : 'Recording: OFF';
        statusEl.className = isRecording ? 'status-on' : 'status-off';
        toggleBtn.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
    });
}

saveBtn.onclick = async () => {
    const settings: Partial<AppSettings> = {
        prefix: prefixInput.value,
        suffix: suffixInput.value,
        theme: themeSelect.value as 'light' | 'dark',
        language: languageSelect.value as 'ru' | 'en',
    };

    await StorageManager.saveSettings(settings);
    updateTheme(settings.theme as 'light' | 'dark');

    statusMsg.textContent = 'Settings saved!';
    statusMsg.className = 'status-msg show';
    setTimeout(() => statusMsg.className = 'status-msg', 2000);
};

toggleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATUS' }, (response) => {
        const nextStatus = !response?.isRecording;
        chrome.runtime.sendMessage({ type: 'SET_RECORDING_STATUS', status: nextStatus }, () => {
            updateUI();
        });
    });
});

// Initial load
loadSettings();
updateUI();
