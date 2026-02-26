import './style.css';
import { StorageManager } from '../storage';

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
}

saveBtn.onclick = async () => {
    await StorageManager.saveSettings({
        prefix: prefixInput.value,
        suffix: suffixInput.value,
        theme: themeSelect.value as 'light' | 'dark',
        language: languageSelect.value as 'ru' | 'en',
    });

    statusMsg.textContent = 'Settings saved!';
    statusMsg.className = 'status-msg show';
    setTimeout(() => statusMsg.className = 'status-msg', 2000);
};

loadSettings();
