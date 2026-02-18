import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        // Папка, куда попадет готовое расширение
        outDir: 'dist',
        rollupOptions: {
            // Определяем несколько точек входа
            input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
                background: resolve(__dirname, 'src/background/main.ts'),
                content: resolve(__dirname, 'src/content/main.ts'),
            },
            output: {
                // Убираем хеши из имен файлов, чтобы manifest.json всегда ссылался на правильные пути
                entryFileNames: 'src/[name]/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
});