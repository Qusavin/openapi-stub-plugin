import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'], // Входной файл
    format: ['cjs', 'esm'],  // Форматы сборки
    dts: true,               // Генерация TypeScript declaration файлов
    sourcemap: true,         // Генерация sourcemap
    clean: true              // Очистка папки dist перед сборкой
});
