/**
 * Простая реализация подсветки синтаксиса TypeScript через регулярные выражения.
 * Без внешних зависимостей.
 */
export function highlightTypeScript(code: string): string {
    // 1. Экранируем HTML
    let html = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 2. Подсветка комментариев
    html = html.replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>');

    // 3. Подсветка ключевых слов (export, default, interface)
    html = html.replace(/\b(export|default|interface)\b/g, '<span class="token-keyword">$1</span>');

    // 4. Подсветка типов (базовых и null)
    html = html.replace(/\b(string|number|boolean|any|unknown|null|void|never)\b/g, '<span class="token-type">$1</span>');

    // 5. Подсветка названий интерфейсов (после слова interface)
    html = html.replace(/(interface\s+)([A-Z]\w*)/g, '$1<span class="token-interface">$2</span>');

    // 6. Подсветка свойств (перед двоеточием)
    // Исключаем случаи, когда это часть URL в комментариях (уже обработаны)
    html = html.replace(/^(\s+)([\w-]+)(?=:)/gm, '$1<span class="token-property">$2</span>');

    // 7. Подсветка кастомных типов (после двоеточия, начинаются с большой буквы)
    html = html.replace(/(: \s*)([A-Z]\w*)/g, '$1<span class="token-type">$2</span>');

    return html;
}
