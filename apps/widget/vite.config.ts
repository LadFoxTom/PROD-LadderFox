import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      styleId: 'hirekit',
      injectCodeFunction: function(cssCode: string) {
        if (typeof document !== 'undefined') {
          const style = document.createElement('style');
          style.setAttribute('data-hirekit', '');
          style.appendChild(document.createTextNode(cssCode));
          document.head.appendChild(style);
        }
      },
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'HireKitWidget',
      fileName: (format) => `hirekit-widget.${format}.js`,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
  },
});
