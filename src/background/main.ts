// Пример: слушаем установку расширения
chrome.runtime.onInstalled.addListener(() => {
    console.log('Расширение успешно установлено!');
    // Используем typed storage
    chrome.storage.local.set({color: '#3aa757'}).then(r => {
        console.log(r, 'Успешно установлено')
    });
});