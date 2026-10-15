import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: 'oxc',
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'JalaUWebComponents',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.umd.cjs'),
      cssFileName: 'style',
    },
    rolldownOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name ?? 'asset';
        },
      },
    },
  },
});
